import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from '@minimum-monorepo/shared-lib';
import { env } from 'hono/adapter';
import type { LambdaContext, LambdaEvent } from 'hono/aws-lambda';
import { requestId } from 'hono/request-id';
import wellnessApi from './routes';

type ENV = {
	TEST_ENV_VAR: string;
};
type Bindings = {
	event: LambdaEvent;
	lambdaContext: LambdaContext;
};
// Create main app
const app = new OpenAPIHono<{ Bindings: Bindings }>();
app.use('*', requestId());

app.get('/', (c) => {
	logger.info('Root endpoint hit', {
		path: c.req.path,
		userAgent: c.req.header('user-agent') ?? 'unknown'
	});
	return c.text('Hello Hono!hono hono');
});

app.get('/hc', (c) => {
	const v = env<ENV>(c);
	logger.info(
		`Lambda function's health check endpoint hit:${c.env.lambdaContext}`
	);
	logger.info('Health check requested', {
		path: c.req.path,
		requestId: c.get('requestId'),
		env_test: v.TEST_ENV_VAR
	});
	return c.text('Hello Hono! Health Check');
});

app.route('/v1', wellnessApi);

// app.doc('/doc', {
// 	openapi: '3.0.0', // OpenAPIのバージョン
// 	info: {
// 		version: '1.0.0',
// 		title: 'Wellness API', // APIのタイトル
// 		description:
// 			'An API to manage wellness activities, built with Hono and OpenAPI.'
// 	}
// 	// servers: [{ url: 'http://localhost:3000', description: 'Development server' }]
// });

export default app;
