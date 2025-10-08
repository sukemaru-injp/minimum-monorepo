import {
	createLogger as createWinstonLogger,
	type Logger as WinstonLogger,
	type LoggerOptions as WinstonLoggerOptions,
	format as winstonFormat,
	transports as winstonTransports
} from 'winston';

export interface CreateLoggerOptions extends WinstonLoggerOptions {
	/**
	 * Whether a console transport should be automatically added when no
	 * transports are provided. Enabled by default for local usage.
	 */
	enableConsoleTransport?: boolean;
}

const defaultFormat = winstonFormat.combine(
	winstonFormat.timestamp(),
	winstonFormat.errors({ stack: true }),
	winstonFormat.splat(),
	winstonFormat.json()
);

const buildTransports = (
	transports: WinstonLoggerOptions['transports'],
	enableConsoleTransport: boolean
): WinstonLoggerOptions['transports'] => {
	if (Array.isArray(transports) && transports.length > 0) {
		return transports;
	}

	if (transports) {
		return transports;
	}

	if (!enableConsoleTransport) {
		return [];
	}

	return [new winstonTransports.Console()];
};

export const createLogger = (
	options: CreateLoggerOptions = {}
): WinstonLogger => {
	const {
		format = defaultFormat,
		transports,
		defaultMeta,
		level,
		enableConsoleTransport = true,
		...rest
	} = options;

	return createWinstonLogger({
		level: level ?? process.env.LOG_LEVEL ?? 'info',
		format,
		defaultMeta: {
			service: 'minimum-monorepo-app',
			...defaultMeta
		},
		transports: buildTransports(transports, enableConsoleTransport),
		...rest
	});
};

export type Logger = WinstonLogger;

export const logger = createLogger();
