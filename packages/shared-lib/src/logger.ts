import pino, { type LoggerOptions, type Logger as PinoLogger } from 'pino';

export interface CreateLoggerOptions extends LoggerOptions {
	/**
	 * Whether console logging is enabled. Enabled by default.
	 * If set to false, logs are disabled (pino option `enabled: false`).
	 */
	enableConsoleTransport?: boolean;
}

export interface Logger {
	trace: (message: unknown, meta?: Record<string, unknown>) => void;
	debug: (message: unknown, meta?: Record<string, unknown>) => void;
	info: (message: unknown, meta?: Record<string, unknown>) => void;
	warn: (message: unknown, meta?: Record<string, unknown>) => void;
	error: (message: unknown, meta?: Record<string, unknown>) => void;
	fatal: (message: unknown, meta?: Record<string, unknown>) => void;
	child: (bindings: Record<string, unknown>) => Logger;
}

const callWithMessageAndMeta = (
	fn: (objOrMsg: unknown, msg?: string) => void,
	message: unknown,
	meta?: Record<string, unknown>
) => {
	if (typeof message === 'string') {
		if (meta && typeof meta === 'object') {
			fn(meta, message);
			return;
		}
		fn(message);
		return;
	}

	if (message instanceof Error) {
		const err = message as Error;
		const obj = { ...(meta ?? {}), err } as Record<string, unknown>;
		fn(obj, err.message);
		return;
	}

	if (message && typeof message === 'object' && typeof meta === 'string') {
		fn(message, meta);
		return;
	}

	fn(message);
};

const wrapPino = (base: PinoLogger): Logger => ({
	trace: (message, meta) =>
		callWithMessageAndMeta(base.trace.bind(base), message, meta),
	debug: (message, meta) =>
		callWithMessageAndMeta(base.debug.bind(base), message, meta),
	info: (message, meta) =>
		callWithMessageAndMeta(base.info.bind(base), message, meta),
	warn: (message, meta) =>
		callWithMessageAndMeta(base.warn.bind(base), message, meta),
	error: (message, meta) =>
		callWithMessageAndMeta(base.error.bind(base), message, meta),
	fatal: (message, meta) =>
		callWithMessageAndMeta(base.fatal.bind(base), message, meta),
	child: (bindings) => wrapPino(base.child(bindings))
});

export const createLogger = (options: CreateLoggerOptions = {}): Logger => {
	const { level, base, enableConsoleTransport = true, ...rest } = options;

	const pinoLogger = pino({
		level: level ?? (process.env.LOG_LEVEL as LoggerOptions['level']) ?? 'info',
		base: {
			service: 'minimum-monorepo-app',
			...base
		},
		enabled: enableConsoleTransport,
		// Keep remaining options pass-through for flexibility
		...rest
	});

	return wrapPino(pinoLogger);
};

export const logger: Logger = createLogger();
