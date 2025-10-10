import { z } from '@hono/zod-openapi';

// Get /sample - Request & Response
export const GetSampleResponseSchema = z.object({
	id: z.string().openapi({
		example: 'xxxxx'
	}),
	title: z.string().min(1, 'Title is required').openapi({
		example: 'ジャガイモを買う'
	})
});
