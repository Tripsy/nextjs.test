import {
    RegisterFormSchema,
    RegisterFormState,
    RegisterFormValues
} from '@/app/account/register/register-form.definition';
import {registerAccount} from '@/lib/services/account.service';

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
    return RegisterFormSchema.safeParse(values);
}

export async function registerAction(state: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
    const values = registerFormValues(formData);
    const validated = registerValidate(values);

    const result: RegisterFormState = {
        ...state, // Spread existing state
        values, // Override with new values
        message: null,
        status: null
    };

    if (!validated.success) {
        return {
            ...result,
            errors: validated.error.flatten().fieldErrors
        };
    }

    const fetchResponse = await registerAccount(validated.data);

    return {
        ...result,
        errors: {},
        message: fetchResponse.message,
        status: fetchResponse.success ? 'success' : 'error'
    };
}