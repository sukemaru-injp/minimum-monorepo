import type { RouteHandler } from '@hono/zod-openapi';
import { logger } from '@minimum-monorepo/shared-lib';
import { DatabaseError } from 'pg';
import { db } from '../../db';
import type { postSampleRoute } from './';

interface CreateUserPayload {
	email?: string;
	name: string;
}

const toISOString = (value: Date | string): string =>
	value instanceof Date ? value.toISOString() : new Date(value).toISOString();

const handler: RouteHandler<typeof postSampleRoute> = async (c) => {
	const { email = 'example.test@example.com', name } =
		await c.req.json<CreateUserPayload>();

	try {
		const insertedUser = await db
			.insertInto('users')
			.values({
				email,
				name,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			})
			.returning(['id', 'email', 'name', 'created_at', 'updated_at'])
			.executeTakeFirstOrThrow();

		const response = {
			id: insertedUser.id,
			email: insertedUser.email,
			name: insertedUser.name,
			createdAt: toISOString(insertedUser.created_at),
			updatedAt: toISOString(insertedUser.updated_at)
		};

		return c.json(response, 200);
	} catch (error) {
		if (error instanceof DatabaseError && error.code === '23505') {
			logger.warn('Duplicate user email detected', { email });
			return c.json({ message: 'User with this email already exists' }, 409);
		}

		logger.error('Failed to create user', { error, email });
		return c.json({ message: 'Failed to create user' }, 500);
	}
};

export default handler;
