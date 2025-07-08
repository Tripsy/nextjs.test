import {getObjectValue} from '@/lib/utils/string';

const settings = {
    environment: process.env.NODE_ENV || 'development',
    url: process.env.FRONTEND_URL || 'http://nextjs.test',
    name: 'NextJs',
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
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
    },
    cache: {
        ttl: Number(process.env.CACHE_TTL) || 60
    },
};

export function app(key: string): any {
    return getObjectValue(settings, key);
}