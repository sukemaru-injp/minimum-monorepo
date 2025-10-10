import { serve } from '@hono/node-server';
import { logger } from '@minimum-monorepo/shared-lib';
import { OpenAPIHono } from '@hono/zod-openapi';
import wellnessApi from './routes';

// Create main app
const app = new OpenAPIHono();

app.get('/', (c) => {
	logger.info('Root endpoint hit', {
		path: c.req.path,
		userAgent: c.req.header('user-agent') ?? 'unknown'
	});
	return c.text('Hello Hono!hono hono');
});

app.get('/hc', (c) => {
	logger.warn('Health check requested', {
		path: c.req.path
	});
	return c.text('Hello Hono! Health Check');
});

app.route('/v1', wellnessApi);

app.doc('/doc', {
	openapi: '3.0.0', // OpenAPIのバージョン
	info: {
		version: '1.0.0',
		title: 'Wellness API', // APIのタイトル
		description:
			'An API to manage wellness activities, built with Hono and OpenAPI.'
	}
	// servers: [{ url: 'http://localhost:3000', description: 'Development server' }]
});

serve(
	{
		fetch: app.fetch,
		port: 3050
	},
	(info) => {
		logger.info('Server started', { port: info.port });
	}
);
