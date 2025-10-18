import { cfg } from '@/config/settings';
import { getObjectValue, replaceVars } from '@/lib/utils/string';

const en = {
	app: {
		name: cfg('name'),
	},
	error: {
		csrf: 'Error occurred while processing your request. Please reload page and try again.',
		form: 'Something went wrong while processing your request.',
		validation: 'Form validation failed.',
	},
	auth: {
		message: {
			already_logged_in: 'Already logged in',
			unauthorized: 'Access denied',
		},
	},
	login: {
		meta: {
			title: `Login | ${cfg('name')}`,
		},
		validation: {
			email: 'Enter a valid email',
			password: 'Enter your password',
		},
		message: {
			could_not_login:
				"We couldn't log you in. Verify your details and try again.",
			auth_success: 'Authenticated successfully',
			auth_error: 'Login failed due to an authentication error.',
			not_active: "We couldn't log you in. Your account is not active.",
			max_active_sessions: 'Too many active sessions',
			too_many_login_attempts:
				'Too many failed login attempts. Please try again later.',
		},
	},
	logout: {
		meta: {
			title: `Logout | ${cfg('name')}`,
		},
		message: {
			success: 'Logout successfully',
			error: 'Logout failed',
			not_logged_in: 'You are not logged in',
		},
	},
	register: {
		meta: {
			title: `Create account | ${cfg('name')}`,
		},
		validation: {
			name_invalid: 'Set your name',
			name_min: 'Name must be at least {{min}} characters long',
			email_invalid: 'Enter a valid email',
			password_invalid: 'Enter your password',
			password_min: 'Password must be at least {{min}} characters long',
			password_condition_capital_letter:
				'Password must contain at least one capital letter',
			password_condition_number:
				'Password must contain at least one number',
			password_condition_special_character:
				'Password must contain at least one special character',
			password_confirm_required: 'Password confirmation is required',
			password_confirm_mismatch: 'Passwords does not match',
			language_invalid: 'Invalid language selected',
			terms_required: 'You must accept the terms and conditions',
			email_already_used: 'Email already used by another account',
		},
		message: {
			success:
				'Thank you for registering. Please check your email to confirm your account.',
		},
	},
	users: {
		validation: {
			name_invalid: 'Enter name',
			name_min: 'Name must be at least {{min}} characters long',
			email_invalid: 'Set valid email',
			password_invalid: 'Set password',
			password_min: 'Password must be at least {{min}} characters long',
			password_condition_capital_letter:
				'Password must contain at least one capital letter',
			password_condition_number:
				'Password must contain at least one number',
			password_condition_special_character:
				'Password must contain at least one special character',
			password_confirm_required: 'Password confirmation is required',
			password_confirm_mismatch: 'Passwords does not match',
			language_invalid: 'Invalid language selected',
			role_invalid: 'Invalid role selected',
			email_already_used: 'Email already used by another account',
		},
		action: {
			create: {
				title: 'Add new user',
				label: 'Add',
				success: 'New user added.',
			},
			update: {
				title: 'Edit user',
				label: 'Update',
				success: 'User updated .',
			},
			delete: {
				title: 'Delete user',
				label: 'Delete',
				success: 'User deleted.',
			},
			enable: {
				title: 'Enable user',
				label: 'Enable',
				success: 'User status marked as `Active`.',
			},
			disable: {
				title: 'Disable user',
				label: 'Disable',
				success: 'User status marked as `Inactive`.',
			},
			restore: {
				title: 'Restore user',
				label: 'Restore',
				success: 'User restored.',
			},
		},
	},
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
