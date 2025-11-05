# Wellness API デプロイ手順

`terraform/` 配下で管理しているインフラへ `wellness-api` をデプロイするための手順書です。ターゲット環境は ECS Fargate（ALB 経由で公開）と RDS PostgreSQL を使用します。

## アーキテクチャ概要
- ECS Fargate サービス（`terraform/ecs.tf`）でアプリケーションをプライベートサブネットに配置。
- ALB（`terraform/ecs.tf`）が外部からのリクエストを受け付け、ECS サービスへルーティング。
- RDS PostgreSQL インスタンス（`terraform/rds.tf`）はプライベートサブネットに配置され、ECS セキュリティグループからのみアクセス可能。
- VPC／サブネット／ルートテーブル／セキュリティグループは `terraform/network.tf` と `terraform/security.tf` で定義。

## 前提条件
- AWS アカウントおよび十分な権限（ECR・ECS・RDS・IAM・VPC・CloudWatch Logs）。
- AWS CLI v2 が認証済みで利用可能（`aws configure` または SSO）。
- Terraform v1.5 以上がインストール済み（`terraform -version`）。
- ローカルで Docker が起動できること。
- リポジトリルートで `pnpm install` が正常に実行できる環境。
- Wellness API 用の Amazon ECR リポジトリ（例: `wellness-api`）が存在すること。

## Step 1: Terraform 変数の準備
1. `terraform/terraform.tfvars`（または環境別ワークスペース）を作成し、最低限以下を設定:
   ```hcl
   project_name    = "minimum-app"
   container_image = "111111111111.dkr.ecr.ap-northeast-1.amazonaws.com/wellness-api:latest"
   db_username     = "wellness_app"
   db_password     = "強力なパスワードに置き換えてください"
   db_name         = "wellness_app"
   ```
2. 必要に応じて CIDR、タスク数、DB ストレージサイズなどを調整。

## Step 2: インフラの構築／更新
1. `terraform/` ディレクトリで以下を実行:
   ```sh
   terraform init
   terraform workspace select prod || terraform workspace new prod
   terraform plan
   terraform apply
   ```
2. 出力値を控える。`alb_dns_name` は公開用エンドポイント、`rds_endpoint` は DB 接続に使用。

## Step 3: コンテナイメージのビルド & プッシュ
1. 依存関係をインストールし、ビルド:
   ```sh
   pnpm install --filter wellness-api
   pnpm --filter wellness-api run build
   ```
2. リポジトリルートで Docker イメージをビルド:
   ```sh
   export AWS_REGION=ap-northeast-1
   export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
   export IMAGE_REPO="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/wellness-api"
   export IMAGE_TAG="$(date +%Y%m%d%H%M)-$(git rev-parse --short HEAD)"

   docker build -f apps/wellness-api/Dockerfile -t "${IMAGE_REPO}:${IMAGE_TAG}" apps/wellness-api
   ```
3. ECR にログインしプッシュ:
   ```sh
   aws ecr get-login-password --region "${AWS_REGION}" \
     | docker login --username AWS --password-stdin "${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
   docker push "${IMAGE_REPO}:${IMAGE_TAG}"
   ```
4. `terraform.tfvars` の `container_image` をプッシュしたイメージ URI に更新（または Terraform 実行時に `-var` で指定）。

## Step 4: ECS サービス更新
1. 新しいイメージ URI を指定して Terraform を再実行:
   ```sh
   terraform plan -var="container_image=${IMAGE_REPO}:${IMAGE_TAG}"
   terraform apply -var="container_image=${IMAGE_REPO}:${IMAGE_TAG}"
   ```
2. Terraform が新しいタスク定義リビジョンを登録し、Fargate でローリングデプロイが走る。進行状況は AWS コンソール（`ECS > Clusters > minimum-app-prod-cluster > Services`）で確認。

## Step 5: アプリケーションシークレットの整備
現状 `apps/wellness-api/src/db/index.ts` で PostgreSQL 認証情報がハードコードされているため、本番運用前に以下を実施:
1. DB ホスト／ポート／ユーザー／パスワード／DB 名を環境変数（例: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`）から読み込むようコードを修正。
2. 機密情報は AWS Secrets Manager または SSM Parameter Store に保管。
3. `terraform/ecs.tf` の `aws_ecs_task_definition.app` で `secrets` ブロックを用い、保管したシークレットを参照。
4. Terraform を再適用し、Step 4 と同様にデプロイを更新。

## Step 6: データベース初期化
1. `psql` などで RDS に接続し、スキーマを作成:
   ```sh
   psql "host=${RDS_ENDPOINT} port=5432 dbname=wellness_app user=wellness_app password=..."
   ```
2. アプリが必要とするマイグレーション／初期データを投入。（現状自動マイグレーションは未実装のため、導入を検討。）

## Step 7: スモークテスト
1. Terraform の出力で ALB DNS を取得: `terraform output alb_dns_name`
2. ALB 経由でヘルスチェック:
   ```sh
   curl "http://${ALB_DNS_NAME}/"
   ```
3. CloudWatch Logs（`Logs > Log groups > /ecs/minimum-app-prod`）でログを確認し、ECS サービスのタスクステータスを点検。

## 運用メモ
- 新しいイメージをリリースするたびに Step 3〜4 を繰り返す。
- `terraform plan` を定期的に実行し、ドリフトや変更点を把握。
- CloudWatch アラームで ECS ヘルスや RDS 指標（CPU・接続数など）を監視設定。
- 手動手順が固まったら CI/CD（例: GitHub Actions）を導入し、ビルド・プッシュ・Terraform Apply を自動化する。
