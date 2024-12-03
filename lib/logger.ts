import dayjs from 'dayjs'
import chalk from 'chalk'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
	level: LogLevel
	message: string
	timestamp: string
	caller: string
	data?: Record<string, unknown>
}

function parseDataToLog(data: Record<string, unknown>) {
	return JSON.stringify(data, null, 2)
}

const isBrowser = typeof window !== 'undefined'
const isProduction = process.env.NODE_ENV === 'production'

export function logger(
	level: LogLevel = 'debug',
	message: string,
	data?: Record<string, unknown>
) {
	if (isBrowser && isProduction) {
		return // Omit logs in production browser environment
	}

	const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
	const caller =
		new Error().stack?.split('\n')[2]?.trim().split(' ')[1] || 'Unknown'
	const logEntry: LogEntry = {
		level,
		message,
		timestamp,
		caller,
		data,
	}

	const coloredLevel = (() => {
		switch (level) {
			case 'info':
				return chalk.blueBright(level.toUpperCase())
			case 'warn':
				return chalk.yellowBright(level.toUpperCase())
			case 'error':
				return chalk.redBright(level.toUpperCase())
			case 'debug':
				return chalk.greenBright(level.toUpperCase())
			default:
				return level
		}
	})()

	const formattedMessage =
		chalk.yellowBright(`[${logEntry.timestamp}]`) +
		` ${coloredLevel} ` +
		chalk.cyanBright(`(${logEntry.caller}):`) +
		` ${logEntry.message}`

	switch (level) {
		case 'info':
			if (data) {
				console.info(formattedMessage, parseDataToLog(data));
			} else {
				console.info(formattedMessage);
			}
			break;
		case 'warn':
			if (data) {
				console.warn(formattedMessage, parseDataToLog(data));
			} else {
				console.warn(formattedMessage);
			}
			break;
		case 'error':
			if (data) {
				console.error(formattedMessage, parseDataToLog(data));
			} else {
				console.error(formattedMessage);
			}
			break;
		case 'debug':
			if (data) {
				console.debug(formattedMessage, parseDataToLog(data));
			} else {
				console.debug(formattedMessage);
			}
			break;
		default:
			if (data) {
				console.log(formattedMessage, JSON.stringify(data));
			} else {
				console.log(formattedMessage);
			}
	}

	// Here you could add additional functionality like:
	// - Sending logs to a remote logging service
	// - Writing logs to a file
	// - Filtering logs based on environment (e.g., not logging debug in production)
}
