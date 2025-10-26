import { build } from 'esbuild';
import config from '../esbuild.config.mjs';

try {
	await build(config);
} catch (error) {
	console.error(error);
	process.exitCode = 1;
}
