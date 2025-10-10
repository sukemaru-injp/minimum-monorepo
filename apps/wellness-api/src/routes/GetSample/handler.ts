import type { RouteHandler } from '@hono/zod-openapi';
import type { getSampleRoute } from './';

const handler: RouteHandler<typeof getSampleRoute> = async (c) => {
	return c.json({
		id: 'xxxxx',
		title: 'ジャガイモを買いたいと思っている'
	});
};

export default handler;
