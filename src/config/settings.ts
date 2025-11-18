import {
	getObjectValue,
	type ObjectValue,
	setObjectValue,
} from '@/lib/utils/string';

const settingsConfig: { [key: string]: ObjectValue } = {
	app: {
		language: process.env.NEXT_PUBLIC_APP_LANGUAGE || 'en',
		languageSupported: (process.env.NEXT_PUBLIC_APP_SUPPORTED_LANGUAGES || 'en')
			.trim()
			.split(','),
		environment: process.env.NODE_ENV || 'development',
		url: process.env.FRONTEND_URL || 'http://nextjs.test',
		name: process.env.NEXT_PUBLIC_FRONTEND_APP_NAME,
		rootPath: process.env.ROOT_PATH || '/var/www/html',
		srcPath: process.env.SRC_PATH || '/var/www/html/src',
	},
	security: {
		allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',').map((v) =>
			v.trim(),
		) || ['http://localhost:3000', 'http://nextjs.test'],
	},
	csrf: {
		cookieName: 'x-csrf-secret',
		cookieMaxAge: 60 * 60, // 1 hour
		inputName: 'x-csrf-token',
	},
	user: {
		nameMinLength: 3,
		passwordMinLength: 8,
		// loginMaxFailedAttemptsForIp: 5,
		// loginMaxFailedAttemptsForEmail: 3,
		// LoginFailedAttemptsLockTime: 900, // block logins for 15 minutes when too many failed attempts
		sessionToken: process.env.SESSION_TOKEN || 'session',
		sessionMaxAge: 60 * Number(process.env.SESSION_MAX_AGE || 10800),
	},
	remoteApi: {
		url: process.env.REMOTE_API_URL || '',
	},
	middleware: {
		rate_limit_window: Number(process.env.RATE_LIMIT_WINDOW) || 60, // seconds
		max_requests: Number(process.env.MAX_REQUESTS) || 100, // Max requests per window
	},
	redis: {
		host: process.env.REDIS_HOST || 'localhost',
		port: process.env.REDIS_PORT || '6379',
		password: process.env.REDIS_PASSWORD || undefined,
	},
	cache: {
		ttl: process.env.CACHE_TTL || 60,
	},
};

/**
 * Enhanced configuration function
 * - Get value: cfg('app.language')
 * - Set value: cfg('app.language', 'en')
 * - Check existence: cfg('app.language', undefined, true) returns boolean
 *
 * @param {string} key - The configuration key
 * @returns {string | boolean | void} - The value, existence boolean, or undefined when setting
 */
export function cfg(key: string): ObjectValue;
export function cfg(key: string, value: ObjectValue): void;
export function cfg(key: string, checkOnly: boolean): boolean;
export function cfg(
	key: string,
	value?: ObjectValue,
	checkOnly?: boolean,
): ObjectValue | boolean | undefined {
	if (checkOnly) {
		return getObjectValue(settingsConfig, key) !== undefined;
	}

	// Set mode
	if (value !== undefined) {
		const success = setObjectValue(settingsConfig, key, value);

		if (!success) {
			console.warn(`Failed to set configuration key: ${key}`);
		}

		return;
	}

	// Get mode
	const result = getObjectValue(settingsConfig, key);

	if (result === undefined) {
		console.warn(`Configuration key not found: ${key}`);
	}

	return result;
}

export const isSupportedLanguage = (language: string): boolean => {
	const languages = cfg('app.languageSupported') as string[];

	return Array.isArray(languages) && languages.includes(language);
}
