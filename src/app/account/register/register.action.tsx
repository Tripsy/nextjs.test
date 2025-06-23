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
        language: (formData.get('language') || 'en') as string,
        terms: formData.get('terms') === 'on', // Convert checkbox value to boolean
    };
}

export function registerValidate(values: Partial<RegisterFormValues>) {
    return RegisterFormSchema.safeParse(values);
}

export async function registerAction(state: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
    const values = registerFormValues(formData);
    const validated = registerValidate(values);

    if (!validated.success) {
        return {
            values: values,
            errors: validated.error.flatten().fieldErrors,
            message: null,
            response: null
        };
    }

    const fetchResponse = await registerAccount(validated.data);

    if (!fetchResponse.success) {
        return {
            values: values,
            errors: {},
            message: fetchResponse.message,
            response: 'error'
        };
    }

    return {
        values: values,
        errors: {},
        message: fetchResponse.message,
        response: 'success'
    };
}