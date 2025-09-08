import {z} from 'zod';
import {lang} from '@/config/lang';
import {cfg} from '@/config/settings';

export const RegisterSchema = z.object({
    name: z
        .string({
            message: lang('register.validation.name_invalid')
        })
        .min(parseInt(cfg('user.nameMinLength')), {
            message: lang('register.validation.name_min', {min: cfg('user.nameMinLength')}),
        })
        .trim(),
    email: z
        .string({
            message: lang('register.validation.email_invalid')
        })
        .email({
            message: lang('register.validation.email_invalid')
        })
        .trim(),
    password: z
        .string({message: lang('register.validation.password_invalid')})
        .min(parseInt(cfg('user.passwordMinLength')), {
            message: lang('register.validation.password_min', {min: cfg('user.passwordMinLength')}),
        })
        .refine((value) => /[A-Z]/.test(value), {
            message: lang('register.validation.password_condition_capital_letter'),
        })
        .refine((value) => /[0-9]/.test(value), {
            message: lang('register.validation.password_condition_number'),
        })
        .refine((value) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value), {
            message: lang('register.validation.password_condition_special_character'),
        }),
    password_confirm: z
        .string({
            message: lang('register.validation.password_confirm_required')
        })
        .nonempty({
            message: lang('register.validation.password_confirm_required')
        })
        .trim(),
    language: z
        .string({
            message: lang('register.validation.language_invalid')
        })
        .length(2, {
            message: lang('register.validation.language_invalid')
        })
        .trim(),
    terms: z.literal(true, {
        errorMap: () => ({
            message: lang('register.validation.terms_required')
        }),
    }),
})
.superRefine(({password, password_confirm}, ctx) => {
    if (password !== password_confirm) {
        ctx.addIssue({
            path: ['password_confirm'],
            message: lang('register.validation.password_confirm_mismatch'),
            code: z.ZodIssueCode.custom,
        });
    }
});

export type RegisterFormValues = {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
    language: string;
    terms: boolean;
};

export type RegisterSituation = 'success' | 'error' | null;

export type RegisterState = {
    values: RegisterFormValues;
    errors: Partial<Record<keyof RegisterFormValues, string[]>>;
    message: string | null;
    situation: RegisterSituation;
};

export const RegisterDefaultState: RegisterState = {
    values: {
        name: '',
        email: '',
        password: '',
        password_confirm: '',
        language: 'en',
        terms: false,
    },
    errors: {},
    message: null,
    situation: null
};