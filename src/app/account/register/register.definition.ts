import { z } from 'zod';
import { lang } from '@/config/lang';
import { cfg } from '@/config/settings';
import { LanguageEnum } from '@/lib/enums';
import type { FormSituationType } from '@/lib/types';

export type RegisterFormFieldsType = {
	name: string;
	email: string;
	password: string;
	password_confirm: string;
	language: LanguageEnum;
	terms: boolean;
};

export type RegisterSituationType = FormSituationType | 'csrf_error';

export type RegisterStateType = {
	values: RegisterFormFieldsType;
	errors: Partial<Record<keyof RegisterFormFieldsType, string[]>>;
	message: string | null;
	situation: RegisterSituationType;
};

export const RegisterState: RegisterStateType = {
	values: {
		name: '',
		email: '',
		password: '',
		password_confirm: '',
		language: LanguageEnum.RO,
		terms: false,
	},
	errors: {},
	message: null,
	situation: null,
};

export const RegisterSchema = z
	.object({
		name: z
			.string({ message: lang('register.validation.name_invalid') })
			.trim()
			.min(Number(cfg('user.nameMinLength')), {
				message: lang('register.validation.name_min', {
					min: cfg('user.nameMinLength'),
				}),
			}),
		email: z
			.string({ message: lang('register.validation.email_invalid') })
			.trim()
			.email({
				message: lang('register.validation.email_invalid'),
			}),
		password: z
			.string({ message: lang('register.validation.password_invalid') })
			.trim()
			.min(Number(cfg('user.passwordMinLength')), {
				message: lang('register.validation.password_min', {
					min: cfg('user.passwordMinLength'),
				}),
			})
			.refine((value) => /[A-Z]/.test(value), {
				message: lang(
					'register.validation.password_condition_capital_letter',
				),
			})
			.refine((value) => /[0-9]/.test(value), {
				message: lang('register.validation.password_condition_number'),
			})
			.refine((value) => /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(value), {
				message: lang(
					'register.validation.password_condition_special_character',
				),
			}),
		password_confirm: z
			.string({
				message: lang('register.validation.password_confirm_required'),
			})
			.trim()
			.nonempty({
				message: lang('register.validation.password_confirm_required'),
			}),
		language: z.nativeEnum(LanguageEnum, {
			message: lang('register.validation.language_invalid'),
		}),
		terms: z.literal(true, {
			errorMap: () => ({
				message: lang('register.validation.terms_required'),
			}),
		}),
	})
	.superRefine(({ password, password_confirm }, ctx) => {
		if (password !== password_confirm) {
			ctx.addIssue({
				path: ['password_confirm'],
				message: lang('register.validation.password_confirm_mismatch'),
				code: z.ZodIssueCode.custom,
			});
		}
	});
