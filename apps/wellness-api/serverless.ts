import type { AWS } from '@serverless/typescript';

const serverlessConfiguration = {
	service: 'wellness-api',
	frameworkVersion: '4',
	package: {
		patterns: ['!scripts/**']
	},
	provider: {
		name: 'aws',
		runtime: 'nodejs22.x',
		region: 'ap-northeast-1',
		stage: 'dev',
		environment: {
			TEST_ENV_VAR: '${ssm:TEST_ENV_VAR}'
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
					http: {
						path: '/{proxy+}',
						method: 'any'
					}
				},
				{
					http: {
						path: '/',
						method: 'any'
					}
				}
			],
			timeout: 15,
			memorySize: 512
		}
	},
	build: {
		esbuild: {
			bundle: true,
			minify: true,
			sourcemap: false,
			exclude: ['aws-sdk'],
			format: 'esm',
			outExtension: { '.js': '.js' },
			target: 'node22',
			platform: 'node',
			tsconfig: './tsconfig.json',
			banner: {
				// Provide CommonJS-style require for deps that still call require()
				js: "import { createRequire as __createRequire } from 'module';\nconst require = __createRequire(import.meta.url);"
			}
		}
	}
} satisfies AWS;

export default serverlessConfiguration;
