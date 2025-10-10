import type { RouteHandler } from '@hono/zod-openapi';
import type { postSampleRoute } from './';

const handler: RouteHandler<typeof postSampleRoute> = async (c) => {
	const { body } = await c.req.json();

	return c.json({
		id: 'xxxxx',
		body
	});
};

export default handler;
