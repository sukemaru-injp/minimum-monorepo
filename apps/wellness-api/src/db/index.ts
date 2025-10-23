import { logger } from '@minimum-monorepo/shared-lib';
import {
	type Generated,
	type Insertable,
	Kysely,
	PostgresDialect,
	type Selectable
} from 'kysely';
import { Pool, types } from 'pg';

types.setTypeParser(20, (value) => Number.parseInt(value, 10));
types.setTypeParser(1700, (value) => Number.parseFloat(value));

// Temporary hardcoded connection string until environment variables are wired.

const pool = new Pool({
	host: 'localhost', // Docker外から接続する場合
	port: 5432,
	user: 'wellness',
	password: 'wellness_dev_pass',
	database: 'wellness_database_local',
	max: 10,
	ssl:
		process.env.NODE_ENV === 'production'
			? { rejectUnauthorized: false }
			: undefined
});

pool.on('error', (error) => {
	logger.error('Unexpected database error', { error });
});

const dialect = new PostgresDialect({
	pool
});

interface UsersTable {
	id: Generated<number>;
	email: string;
	name: string;
	created_at: Generated<Date>;
	updated_at: Generated<Date>;
}

export interface Database {
	users: UsersTable;
}

export type UserRow = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;

export const db = new Kysely<Database>({
	dialect
});

logger.info('Database client initialized');
