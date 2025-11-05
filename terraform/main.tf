locals {
  # Terraform 0.11 互換構文でも動作するよう、正規表現関数は避けて単純な整形に留める
  name_prefix = lower("${var.project_name}-${terraform.workspace}")
}

data "aws_availability_zones" "available" {
  state = "available"
}
