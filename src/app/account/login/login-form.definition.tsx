import {z} from 'zod';
import {lang} from '@/config/lang';
import {FormSituation} from '@/lib/types/form-situation.type';
import {ResponseFetch} from '@/lib/api';

export const LoginFormSchema = z.object({
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

export type LoginFormState = {
    values: LoginFormValues;
    errors: Partial<Record<keyof LoginFormValues, string[]>>;
    message: string | null;
    situation: FormSituation | 'max_active_sessions';
    body?: { authValidTokens: AuthTokenListType } | undefined;
};

export const defaultLoginFormState: LoginFormState = {
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