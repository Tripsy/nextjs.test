import {RegisterFormSchema, RegisterFormState} from '@/app/account/register/register-form.definition';

export async function registerAction(state: RegisterFormState, formData: FormData) {
    const values = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        password_confirm: formData.get('password_confirm') as string,
        language: (formData.get('language') || 'en') as string,
        terms: formData.get('terms') === 'on', // Convert checkbox value to boolean
    };
    const validated = RegisterFormSchema.safeParse(values);

    if (!validated.success) {
        return {
            values: values,
            errors: validated.error.flatten().fieldErrors,
        }
    }

    // Call the provider or db to create a user...
}