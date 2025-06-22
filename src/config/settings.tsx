import {getObjectValue, replaceVars} from '@/lib/utils/string';

const settings = {
    name: 'NextJs',
    user: {
        nameMinLength: 3,
        passwordMinLength: 8,
        // loginMaxFailedAttemptsForIp: 5,
        // loginMaxFailedAttemptsForEmail: 3,
        // LoginFailedAttemptsLockTime: 900, // block logins for 15 minutes when too many failed attempts
    }
};

export function app(key: string): any {
    return getObjectValue(settings, key);
}