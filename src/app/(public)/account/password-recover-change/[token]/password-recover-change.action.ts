import { isValidCsrfToken } from '@/lib/actions/csrf.action';
import {
	type PasswordRecoverChangeFormFieldsType,
	PasswordRecoverChangeSchema,
	type PasswordRecoverChangeSituationType,
	type PasswordRecoverChangeStateType,
} from '@/app/(public)/account/password-recover-change/[token]/password-recover-change.definition';
import { translate } from '@/config/lang';
import { cfg } from '@/config/settings';
import { ApiError } from '@/lib/exceptions/api.error';
import { passwordRecoverChangeAccount } from '@/lib/services/account.service';
import {accumulateZodErrors} from "@/lib/helpers/form";

export function passwordRecoverChangeFormValues(
	formData: FormData,
): PasswordRecoverChangeFormFieldsType {
	return {
		password: formData.get('password') as string,
		password_confirm: formData.get('password_confirm') as string,
	};
}

export function passwordRecoverChangeValidate(
	values: PasswordRecoverChangeFormFieldsType,
) {
	return PasswordRecoverChangeSchema.safeParse(values);
}

export async function passwordRecoverChangeAction(
	state: PasswordRecoverChangeStateType,
	formData: FormData,
): Promise<PasswordRecoverChangeStateType> {
	const values = passwordRecoverChangeFormValues(formData);
	const validated = passwordRecoverChangeValidate(values);

	const result: PasswordRecoverChangeStateType = {
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
			errors: accumulateZodErrors<PasswordRecoverChangeFormFieldsType>(
				validated.error,
			)
		};
	}

	try {
		const fetchResponse = await passwordRecoverChangeAccount(
			result.token,
			validated.data,
		);

		return {
			...result,
			errors: {},
			message: fetchResponse?.message || null,
			situation: fetchResponse?.success ? 'success' : 'error',
		};
	} catch (error: unknown) {
		let message: string = '';
		const situation: PasswordRecoverChangeSituationType = 'error';

		if (error instanceof ApiError) {
			message = error.message;
		}

		return {
			...result,
			message:
				message ||
				(await translate('password_recover_change.message.failed')),
			situation: situation,
		};
	}
}
