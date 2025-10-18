import { z } from 'zod';
import { lang } from '@/config/lang';
import type { FormSituationType } from '@/lib/types';

export type LoginFormFieldsType = {
	email: string;
	password: string;
};

export type LoginSituationType =
	| FormSituationType
	| 'csrf_error'
	| 'max_active_sessions';

export type LoginStateType = {
	values: LoginFormFieldsType;
	errors: Partial<Record<keyof LoginFormFieldsType, string[]>>;
	message: string | null;
	situation: LoginSituationType;
	body?: { authValidTokens: AuthTokenListType };
};

export const LoginState: LoginStateType = {
	values: {
		email: '',
		password: '',
	},
	errors: {},
	message: null,
	situation: null,
};

export type AuthTokenType = {
	ident: string;
	label: string;
	used_at: string; // ISO date string
};

export type AuthTokenListType = AuthTokenType[];

export const LoginSchema = z.object({
	email: z
		.string({ message: lang('login.validation.email') })
		.trim()
		.email({ message: lang('login.validation.email') }),
	password: z
		.string({ message: lang('login.validation.password') })
		.trim()
		.nonempty({ message: lang('login.validation.password') }),
});
