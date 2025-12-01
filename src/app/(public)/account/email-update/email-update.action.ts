import { isValidCsrfToken } from '@/actions/csrf.action';
import {
	type EmailUpdateFormFieldsType,
	EmailUpdateSchema,
	type EmailUpdateSituationType,
	type EmailUpdateStateType,
} from '@/app/(public)/account/email-update/email-update.definition';
import { translate } from '@/config/lang';
import { cfg } from '@/config/settings';
import { ApiError } from '@/lib/exceptions/api.error';
import { emailUpdateAccount } from '@/lib/services/account.service';

export function emailUpdateFormValues(
	formData: FormData,
): EmailUpdateFormFieldsType {
	return {
		email_new: formData.get('email_new') as string,
	};
}

export function emailUpdateValidate(values: EmailUpdateFormFieldsType) {
	return EmailUpdateSchema.safeParse(values);
}

export async function emailUpdateAction(
	state: EmailUpdateStateType,
	formData: FormData,
): Promise<EmailUpdateStateType> {
	const values = emailUpdateFormValues(formData);
	const validated = emailUpdateValidate(values);

	const result: EmailUpdateStateType = {
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
		const fetchResponse = await emailUpdateAccount(validated.data);

		return {
			...result,
			errors: {},
			message: fetchResponse?.message || null,
			situation: fetchResponse?.success ? 'success' : 'error',
		};
	} catch (error: unknown) {
		let message: string = '';
		const situation: EmailUpdateSituationType = 'error';

		if (error instanceof ApiError) {
			switch (error.status) {
				case 409:
					message = await translate(
						'account_email_update.validation.email_already_used',
					);
					break;
			}
		}

		return {
			...result,
			errors: {},
			message: message || (await translate('error.form')),
			situation: situation,
		};
	}
}
