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
        sessionLoginRedirect: process.env.SESSION_LOGIN_REDIRECT || undefined,
    },
    backend: {
        api_url: process.env.BACKEND_API_URL || '',
    }
};

export function app(key: string): any {
    return getObjectValue(settings, key);
}