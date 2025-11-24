import { z } from 'zod';
import { translateBatch } from '@/config/lang';
import type { FormSituationType } from '@/lib/types';

export type PasswordRecoverFormFieldsType = {
	email: string;
};

export type PasswordRecoverSituationType =
	| FormSituationType
	| 'csrf_error';

export type PasswordRecoverStateType = {
	values: PasswordRecoverFormFieldsType;
	errors: Partial<Record<keyof PasswordRecoverFormFieldsType, string[]>>;
	message: string | null;
	situation: PasswordRecoverSituationType;
};

export const PasswordRecoverState: PasswordRecoverStateType = {
	values: {
		email: '',
	},
	errors: {},
	message: null,
	situation: null,
};

const translations = await translateBatch([
	'login.validation.email'
]);

export const PasswordRecoverSchema = z.object({
	email: z
		.string()
		.trim()
		.email({ message: translations['login.validation.email'] }),
});
