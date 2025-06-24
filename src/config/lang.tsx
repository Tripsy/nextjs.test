import {app} from '@/config/settings';
import {getObjectValue, replaceVars} from '@/lib/utils/string';

const en = {
    'app': {
        'name': app('name'),
    },
    'login': {
        'meta': {
            'title': `Login | ${app('name')}`,
        },
        'validation': {
            'email': 'Please enter a valid email',
            'password': 'Please enter your password',
        },
        'message': {
            "error": "We couldn\'t log you in. Verify your details and try again.",
            "not_active": "We couldn\'t log you in. Your account is not active.",
            "max_active_sessions": "Too many active sessions",
            "too_many_login_attempts": "Too many failed login attempts. Please try again later."
        }
    },
    'register': {
        'meta': {
            'title': `Create account | ${app('name')}`,
        },
        'validation': {
            'name_invalid': 'Set your name',
            'name_min': 'Name must be at least {{min}} characters long',
            'email_invalid': 'Please enter a valid email',
            'password_invalid': 'Please enter your password',
            'password_min': 'Password must be at least {{min}} characters long',
            'password_condition_capital_letter': 'Password must contain at least one capital letter',
            'password_condition_number': 'Password must contain at least one number',
            'password_condition_special_character': 'Password must contain at least one special character',
            'password_confirm_required': 'Password confirmation is required',
            'password_confirm_mismatch': 'Passwords does not match',
            'language_invalid': 'Invalid language selected',
            'terms_required': 'You must accept the terms and conditions',
        },
        'message': {
            'success': 'Thank you for registering. Please check your email to confirm your account.',
            // 'error': 'We couldn\'t process your submission due to some errors.',
        }
    }
};

export function lang(key: string, data?: Record<string, string>): string {
    let value = getObjectValue(en, key);

    if (typeof value !== 'string') {
        throw new Error(`Invalid key or non-string value at '${key}'`);
    }

    if (data) {
        value = replaceVars(value, data);
    }

    return value;
}