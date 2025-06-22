import {LoginFormSchema, LoginFormState} from '@/app/account/login/login-form.definition';

export async function loginAction(state: LoginFormState, formData: FormData) {
    const values = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };
    const validated = LoginFormSchema.safeParse(values);

    if (!validated.success) {
        return {
            values: values,
            errors: validated.error.flatten().fieldErrors,
        }
    }

    // Call the provider or db to create a user...
}