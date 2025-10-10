import { createRoute } from '@hono/zod-openapi';

import { PostSampleRequestSchema, PostSampleResponseSchema } from './schema';

const postSample = createRoute({
	method: 'post',
	path: '/sample',
	request: {
		body: {
			content: {
				'application/json': {
					schema: PostSampleRequestSchema
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Successful response',
			content: {
				'application/json': {
					schema: PostSampleResponseSchema
				}
			}
		}
	}
});

export default postSample;
