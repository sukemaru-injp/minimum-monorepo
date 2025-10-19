import { serve } from '@hono/node-server';
import { logger } from '@minimum-monorepo/shared-lib';
import app from './app';

serve(
	{
		fetch: app.fetch,
		port: 3050
	},
	(info) => {
		logger.info(`Server started: port:${info.port}`);
	}
);
