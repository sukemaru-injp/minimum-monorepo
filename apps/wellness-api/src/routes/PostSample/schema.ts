import { z } from '@hono/zod-openapi';

export const PostSampleRequestSchema = z.object({
	email: z.string().nullable().openapi({
		example: 'yamada.taro@example.com'
	}),
	name: z.string().min(1, 'Name is required').openapi({
		example: '山田 太郎'
	})
});

export const PostSampleResponseSchema = z.object({
	id: z.number().int().positive().openapi({
		example: 123
	}),
	email: z.string().openapi({
		example: 'yamada.taro@example.com'
	}),
	name: z.string().openapi({
		example: '山田 太郎'
	}),
	createdAt: z.string().openapi({
		example: '2024-01-01T12:00:00.000Z'
	}),
	updatedAt: z.string().openapi({
		example: '2024-01-01T12:10:00.000Z'
	})
});
