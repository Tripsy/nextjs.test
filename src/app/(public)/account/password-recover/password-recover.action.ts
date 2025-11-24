import { createAuth } from '@/actions/auth.actions';
import { isValidCsrfToken } from '@/actions/csrf.action';
import {
	type PasswordRecoverFormFieldsType,
	PasswordRecoverSchema,
	type PasswordRecoverSituationType,
	type PasswordRecoverStateType,
} from '@/app/(public)/account/password-recover/password-recover.definition';
import { translate } from '@/config/lang';
import { cfg } from '@/config/settings';
import { ApiError } from '@/lib/exceptions/api.error';
import { passwordRecoverAccount } from '@/lib/services/account.service';

export function passwordRecoverFormValues(
	formData: FormData,
): PasswordRecoverFormFieldsType {
	return {
		email: formData.get('email') as string,
	};
}

export function passwordRecoverValidate(values: PasswordRecoverFormFieldsType) {
	return PasswordRecoverSchema.safeParse(values);
}

export async function passwordRecoverAction(
	state: PasswordRecoverStateType,
	formData: FormData,
): Promise<PasswordRecoverStateType> {
	const values = passwordRecoverFormValues(formData);
	const validated = passwordRecoverValidate(values);

	const result: PasswordRecoverStateType = {
		...state, // Spread existing state
		values, // Override with new values
		message: null,
		situation: null,
	};

	// Check CSRF token
	const csrfToken = formData.get(cfg('csrf.inputName') as string) as string;

	if (!(await isValidCsrfToken(csrfToken))) {
		return {
			...result,
			message: await translate('error.csrf'),
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
		const fetchResponse = await passwordRecoverAccount(validated.data);

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
		let message: string = '';
		let situation: PasswordRecoverSituationType = 'error';
		let responseBody: { authValidTokens: AuthTokenListType } | undefined;

		if (error instanceof ApiError) {
			switch (error.status) {
				case 429:
					message = await translate(
						'password_recover.message.too_many_login_attempts',
					);
					break;
				case 403:
					message = await translate(
						'password_recover.message.max_active_sessions',
					);
					situation = 'max_active_sessions';
					responseBody = error.body?.data as {
						authValidTokens: AuthTokenListType;
					};
					break;
				case 406:
					situation = 'success'; // Already logged in
					break;
				case 400:
					message = await translate(
						'password_recover.message.not_active',
					);
					break;
			}
		}

		return {
			...result,
			message:
				message ||
				(await translate('password_recover.message.could_not_login')),
			situation: situation,
			body: responseBody,
		};
	}
}
