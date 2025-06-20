import {LoginFormSchema, LoginFormState} from '@/app/account/login/login-form.definition';

export async function loginAction(state: LoginFormState, formData: FormData) {
    const validated = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validated.success) {
        return {
            errors: validated.error.flatten().fieldErrors,
        }
    }

    // Call the provider or db to create a user...
}