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
		// Place the Lambda inside private subnets while keeping outbound access via the specified security group
		vpc: {
			securityGroupIds: [
				'${ssm:/wellness-api/${sls:stage}/lambda-security-group-id}'
			],
			subnetIds: [
				'${ssm:/wellness-api/${sls:stage}/private-subnet-a-id}',
				'${ssm:/wellness-api/${sls:stage}/private-subnet-b-id}'
			]
		},
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
			handler: 'dist/handler.appEntry',
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
	resources: {
		Resources: {
			AppLambdaInvokePermissionForApiGateway: {
				Type: 'AWS::Lambda::Permission',
				Properties: {
					Action: 'lambda:InvokeFunction',
					FunctionName: { 'Fn::GetAtt': ['AppLambdaFunction', 'Arn'] },
					Principal: 'apigateway.amazonaws.com',
					SourceArn: {
						'Fn::Join': [
							'',
							[
								'arn:aws:execute-api:',
								{ Ref: 'AWS::Region' },
								':',
								{ Ref: 'AWS::AccountId' },
								':',
								{ Ref: 'ApiGatewayRestApi' },
								'/*/*'
							]
						]
					}
				}
			}
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
