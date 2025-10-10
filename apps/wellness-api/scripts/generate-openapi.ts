import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { OpenAPIHono } from '@hono/zod-openapi';
import { stringify } from 'yaml';

import wellnessApi from '../src/routes';

const filename = fileURLToPath(import.meta.url);
const dir = dirname(filename);

const app = new OpenAPIHono();
app.route('/v1', wellnessApi);

const document = app.getOpenAPIDocument({
	openapi: '3.0.0',
	info: {
		version: '1.0.0',
		title: 'Wellness API',
		description:
			'An API to manage wellness activities, built with Hono and OpenAPI.'
	}
});

const outputPath = resolve(dir, '../../../shared/openapi.yml');

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, stringify(document), { encoding: 'utf8' });

console.log(`OpenAPI spec generated at: ${outputPath}`);
