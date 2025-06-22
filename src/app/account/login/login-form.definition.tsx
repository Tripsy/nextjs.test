import {z} from 'zod';
import {lang} from '@/config/lang';

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

export type LoginFormState = {
    values: {
        email: string;
        password: string;
    },
    errors?: {
        email?: string[];
        password?: string[];
    }
    message?: string;
} | undefined;