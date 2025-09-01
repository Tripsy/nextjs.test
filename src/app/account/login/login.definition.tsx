import {z} from 'zod';
import {lang} from '@/config/lang';

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

export type LoginFormValues = {
    email: string;
    password: string;
};

export type LoginSituation = 'success' | 'error' | 'max_active_sessions' | null;

export type LoginState = {
    values: LoginFormValues;
    errors: Partial<Record<keyof LoginFormValues, string[]>>;
    message: string | null;
    situation: LoginSituation;
    body?: { authValidTokens: AuthTokenListType } | undefined;
};

export const LoginDefaultState: LoginState = {
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