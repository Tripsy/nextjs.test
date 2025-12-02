import { createAuth } from '@/actions/auth.actions';
import { isValidCsrfToken } from '@/actions/csrf.action';
import {
	type PasswordUpdateFormFieldsType,
	PasswordUpdateSchema,
	type PasswordUpdateSituationType,
	type PasswordUpdateStateType,
} from '@/app/(public)/account/password-update/password-update.definition';
import { translate } from '@/config/lang';
import { cfg } from '@/config/settings';
import { ApiError } from '@/lib/exceptions/api.error';
import { passwordUpdateAccount } from '@/lib/services/account.service';

export function passwordUpdateFormValues(
	formData: FormData,
): PasswordUpdateFormFieldsType {
	return {
		password_current: formData.get('password_current') as string,
		password_new: formData.get('password_new') as string,
		password_confirm: formData.get('password_confirm') as string,
	};
}

export function passwordUpdateValidate(values: PasswordUpdateFormFieldsType) {
	return PasswordUpdateSchema.safeParse(values);
}

export async function passwordUpdateAction(
	state: PasswordUpdateStateType,
	formData: FormData,
): Promise<PasswordUpdateStateType> {
	const values = passwordUpdateFormValues(formData);
	const validated = passwordUpdateValidate(values);

	const result: PasswordUpdateStateType = {
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
			message: await translate('app.error.csrf'),
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
		const fetchResponse = await passwordUpdateAccount(validated.data);

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
		const situation: PasswordUpdateSituationType = 'error';

		if (error instanceof ApiError) {
			switch (error.status) {
				case 401:
					message = await translate(
						'account_password_update.validation.password_current_incorrect',
					);
					break;
			}
		}

		return {
			...result,
			errors: {},
			message: message || (await translate('app.error.form')),
			situation: situation,
		};
	}
}
