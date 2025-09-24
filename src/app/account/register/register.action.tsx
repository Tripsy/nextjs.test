import {
    RegisterSchema,
    RegisterState,
    RegisterFormValues, RegisterSituation
} from '@/app/account/register/register.definition';
import {registerAccount} from '@/lib/services/account.service';
import {lang} from '@/config/lang';
import {ApiError} from '@/lib/exceptions/api.error';
import {cfg} from '@/config/settings';
import {isValidCsrfToken} from '@/actions/csrf.action';

export function registerFormValues(formData: FormData): RegisterFormValues {
    return {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        password_confirm: formData.get('password_confirm') as string,
        language: formData.get('language') as string,
        terms: formData.get('terms') === 'on', // Convert checkbox value to boolean
    };
}

export function registerValidate(values: RegisterFormValues) {
    return RegisterSchema.safeParse(values);
}

export async function registerAction(state: RegisterState, formData: FormData): Promise<RegisterState> {
    const values = registerFormValues(formData);
    const validated = registerValidate(values);

    const result: RegisterState = {
        ...state, // Spread existing state
        values, // Override with new values
        message: null,
        situation: null
    };

    // Check CSRF token
    const csrfToken = formData.get(cfg('csrf.inputName')) as string;

    if (!await isValidCsrfToken(csrfToken)) {
        return {
            ...result,
            message: lang('error.csrf'),
            situation: 'csrf_error',
        };
    }

    if (!validated.success) {
        return {
            ...result,
            situation: 'error',
            errors: validated.error.flatten().fieldErrors
        };
    }

    try {
        const fetchResponse = await registerAccount(validated.data);

        return {
            ...result,
            errors: {},
            message: fetchResponse?.message || null,
            situation: fetchResponse?.success ? 'success' : 'error'
        };
    } catch (error: unknown) {
        let message: string = lang('register.message.error');
        const situation: RegisterSituation = 'error';

        if (error instanceof ApiError) {
            switch (error.status) {
                case 409:
                    message = lang('register.message.email_already_used');
                    break;
            }
        }

        return {
            ...result,
            errors: {},
            message: message,
            situation: situation,
        };
    }
}