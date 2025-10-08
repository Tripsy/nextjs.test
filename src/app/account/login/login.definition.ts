import {z} from 'zod';
import {lang} from '@/config/lang';
import {FormSituationType} from '@/stores/form.type';

export type LoginFormFieldsType = {
    email: string;
    password: string;
};

export type LoginSituationType = FormSituationType | 'csrf_error' | 'max_active_sessions';

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
    situation: null
};

export type AuthTokenType = {
    ident: string;
    label: string;
    used_at: string; // ISO date string
};

export type AuthTokenListType = AuthTokenType[];

export const LoginSchema = z.object({
    email: z
        .string()
        .email({
            message: lang('login.validation.email')
        }).trim(),
    password: z
        .string({
            message: lang('login.validation.password')
        })
        .min(1, {
            message: lang('login.validation.password')
        })
        .trim(),
});