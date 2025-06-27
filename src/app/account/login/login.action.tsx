import {
    AuthTokenListType,
    LoginFormSchema,
    LoginFormState,
    LoginFormValues
} from '@/app/account/login/login-form.definition';
import {createAuth, loginAccount} from '@/lib/services/account.service';
import {ApiError} from '@/lib/exceptions/api.error';
import {lang} from '@/config/lang';
import {FormSituation} from '@/lib/types/form-situation.type';
import {getResponseData, ResponseFetch} from '@/lib/api';

export function loginFormValues(formData: FormData): LoginFormValues {
    return {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };
}

export function loginValidate(values: LoginFormValues) {
    return LoginFormSchema.safeParse(values);
}

export async function loginAction(state: LoginFormState, formData: FormData): Promise<LoginFormState> {
    const values = loginFormValues(formData);
    const validated = loginValidate(values);

    const result: LoginFormState = {
        ...state, // Spread existing state
        values, // Override with new values
        message: null,
        situation: null
    };

    if (!validated.success) {
        return {
            ...result,
            errors: validated.error.flatten().fieldErrors
        };
    }

    try {
        const fetchResponse: ResponseFetch<{token: string}> = await loginAccount(validated.data);

        if (fetchResponse.success && fetchResponse.data?.token) {
            const authResponse = await createAuth(fetchResponse.data.token);

            if (!authResponse.success) {
                return {
                    ...result,
                    errors: {},
                    message: authResponse.message || null,
                    situation: 'error'
                };
            }
        }

        return {
            ...result,
            errors: {},
            message: fetchResponse.message || null,
            situation: fetchResponse.success ? 'success' : 'error'
        };
    } catch (error: unknown) {
        let message: string = lang('login.message.could_not_login');
        let situation: FormSituation | 'max_active_sessions' = 'error';
        let responseBody: ResponseFetch<{ authValidTokens: AuthTokenListType }> | undefined = undefined;

        if (error instanceof ApiError) {
            switch (error.status) {
                case 429:
                    message = lang('login.message.too_many_login_attempts');
                    break;
                case 403:
                    message = lang('login.message.max_active_sessions');
                    situation = 'max_active_sessions';
                    responseBody = error.response
                    break;
                case 406:
                    message = lang('login.message.not_active');
                    break;
            }
        }

        return {
            ...result,
            errors: {},
            message: message,
            situation: situation,
            body: getResponseData(responseBody)
        };
    }
}