import { createRoute } from '@hono/zod-openapi';

import { GetSampleResponseSchema } from './schema';

const getSampleRoute = createRoute({
	method: 'get',
	path: '/sample',
	responses: {
		200: {
			content: {
				'application/json': {
					schema: GetSampleResponseSchema
				}
			},
			description: 'List of samples'
		}
	}
});

export default getSampleRoute;
