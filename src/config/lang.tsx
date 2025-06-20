import {settings} from '@/config/settings';
import {getObjectValue} from '@/lib/utils/string';

const en = {
    'app': {
        'name': settings.appName,
    },
    'login': {
        'meta': {
            'title': `Login | ${settings.appName}`,
        },
        'validation': {
            'email': 'Please enter a valid email',
            'password': 'Please enter your password',
        }
    }
};

export function lang(key: string): string {
    const value = getObjectValue(en, key);

    if (typeof value === 'string') {
        return value;
    }

    throw new Error(`Invalid key or non-string value at "${key}"`);
}