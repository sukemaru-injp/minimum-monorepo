import type { AWS } from '@serverless/typescript';

const serverlessConfiguration = {
	service: 'wellness-api',
	frameworkVersion: '4',
	provider: {
		name: 'aws',
		runtime: 'nodejs22.x',
		region: 'ap-northeast-1',
		stage: 'dev',
		environment: {
			TEST: '${opt:test, "default-test-value"}' // デプロイ時に環境変数を設定可能
		},
		iamRoleStatements: [
			{
				Effect: 'Allow',
				Action: [
					'logs:CreateLogGroup',
					'logs:CreateLogStream',
					'logs:PutLogEvents'
				],
				Resource: '*'
			}
		]
	},
  functions: {
    app: {
      handler: 'dist/handler.handler',
      events: [
        {
          httpApi: {
            path: '/{proxy+}',
            method: '*',
          },
        },
        {
          httpApi: {
            path: '/',
            method: '*',
          },
        },
      ],
      timeout: 15,
      memorySize: 512,
    },
  },
  build: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: false,
      exclude: ['aws-sdk'],
      target: 'node22',
      platform: 'node',
      tsconfig: "./tsconfig.json",
      mainFields: ['module', 'main'],
      conditions: ['import', 'node']
    },
  }
} satisfies AWS;

export default serverlessConfiguration;
