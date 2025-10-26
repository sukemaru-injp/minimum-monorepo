const requireBanner =
	"import { createRequire as __createRequire } from 'module';\nconst require = __createRequire(import.meta.url);";

const baseConfig = {
	bundle: true,
	minify: true,
	sourcemap: false,
	format: 'esm',
	target: 'node22',
	platform: 'node',
	tsconfig: './tsconfig.json',
	banner: {
		js: requireBanner
	},
	external: ['aws-sdk']
};

const entryPoint = process.env.ESBUILD_ENTRY ?? 'server';

const entrySpecificConfig = {
	server: {
		entryPoints: ['./src/server.ts'],
		outfile: './dist/server.js'
	},
	handler: {
		entryPoints: ['./src/handler.ts'],
		outfile: './dist/handler.js'
	},
	all: {
		entryPoints: ['./src/server.ts', './src/handler.ts'],
		outdir: './dist',
		entryNames: '[name]'
	}
}[entryPoint];

if (!entrySpecificConfig) {
	throw new Error(
		`Unsupported ESBUILD_ENTRY value "${entryPoint}". Expected "server", "handler", or "all".`
	);
}

export default {
	...baseConfig,
	...entrySpecificConfig
};
