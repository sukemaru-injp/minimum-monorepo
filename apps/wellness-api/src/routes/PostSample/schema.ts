import { z } from '@hono/zod-openapi';

export const PostSampleRequestSchema = z.object({
	body: z.string().min(1, 'Body is required').openapi({
		example: 'ジャガイモを買う'
	})
});

export const PostSampleResponseSchema = z.object({
	id: z.string().openapi({
		example: 'xxxxx'
	}),
	body: z.string().openapi({
		example: 'ジャガイモを買う'
	})
});
