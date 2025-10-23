import { createRoute } from '@hono/zod-openapi';
import { ErrorResponseSchema } from '../utils/ErrorResponseSchema';
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
			description: 'User created successfully',
			content: {
				'application/json': {
					schema: PostSampleResponseSchema
				}
			}
		},
		409: {
			description: 'Conflict - User with this email already exists',
			content: {
				'application/json': {
					schema: ErrorResponseSchema
				}
			}
		},
		500: {
			description: 'Internal Server Error - Failed to create user',
			content: {
				'application/json': {
					schema: ErrorResponseSchema
				}
			}
		}
	}
});

export default postSample;
