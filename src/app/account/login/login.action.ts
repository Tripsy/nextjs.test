import { createAuth } from '@/actions/auth.actions';
import { isValidCsrfToken } from '@/actions/csrf.action';
import {
	type AuthTokenListType,
	type LoginFormFieldsType,
	LoginSchema,
	type LoginSituationType,
	type LoginStateType,
} from '@/app/account/login/login.definition';
import { lang } from '@/config/lang';
import { cfg } from '@/config/settings';
import { ApiError } from '@/lib/exceptions/api.error';
import { loginAccount } from '@/lib/services/account.service';

export function loginFormValues(formData: FormData): LoginFormFieldsType {
	return {
		email: formData.get('email') as string,
		password: formData.get('password') as string,
	};
}

export function loginValidate(values: LoginFormFieldsType) {
	return LoginSchema.safeParse(values);
}

export async function loginAction(
	state: LoginStateType,
	formData: FormData,
): Promise<LoginStateType> {
	const values = loginFormValues(formData);
	const validated = loginValidate(values);

	const result: LoginStateType = {
		...state, // Spread existing state
		values, // Override with new values
		message: null,
		situation: null,
	};

	// Check CSRF token
	const csrfToken = formData.get(cfg('csrf.inputName')) as string;

	if (!(await isValidCsrfToken(csrfToken))) {
		return {
			...result,
			message: lang('error.csrf'),
			situation: 'csrf_error',
		};
	}

	if (!validated.success) {
		return {
			...result,
			situation: 'error',
			errors: validated.error.flatten().fieldErrors,
		};
	}

	try {
		const fetchResponse = await loginAccount(validated.data);

		if (
			fetchResponse?.success &&
			fetchResponse.data &&
			'token' in fetchResponse.data
		) {
			const authResponse = await createAuth(fetchResponse.data.token);

			if (authResponse?.success) {
				return {
					...result,
					message: authResponse?.message || null,
					situation: 'success',
				};
			} else {
				return {
					...result,
					message: authResponse?.message || null,
					situation: 'error',
				};
			}
		} else {
			return {
				...result,
				message: fetchResponse?.message || null,
				situation: 'error',
			};
		}
	} catch (error: unknown) {
		let message: string = lang('login.message.could_not_login');
		let situation: LoginSituationType = 'error';
		let responseBody: { authValidTokens: AuthTokenListType } | undefined;

		if (error instanceof ApiError) {
			switch (error.status) {
				case 429:
					message = lang('login.message.too_many_login_attempts');
					break;
				case 403:
					message = lang('login.message.max_active_sessions');
					situation = 'max_active_sessions';
					responseBody = error.body?.data as {
						authValidTokens: AuthTokenListType;
					};
					break;
				case 406:
					situation = 'success'; // Already logged in
					break;
				case 400:
					message = lang('login.message.not_active');
					break;
			}
		}

		return {
			...result,
			message: message,
			situation: situation,
			body: responseBody,
		};
	}
}
