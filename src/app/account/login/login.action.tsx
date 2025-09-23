import {
    AuthTokenListType,
    LoginSchema, LoginSituation,
    LoginState,
    LoginFormValues
} from '@/app/account/login/login.definition';
import {loginAccount} from '@/lib/services/account.service';
import {ApiError} from '@/lib/exceptions/api.error';
import {lang} from '@/config/lang';
import {csrfInputName, isValidCsrfToken} from '@/lib/csrf';
import {createAuth} from '@/actions/auth.actions';

export function loginFormValues(formData: FormData): LoginFormValues {
    return {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };
}

export function loginValidate(values: LoginFormValues) {
    return LoginSchema.safeParse(values);
}

export async function loginAction(state: LoginState, formData: FormData): Promise<LoginState> {
    const values = loginFormValues(formData);
    const validated = loginValidate(values);

    const result: LoginState = {
        ...state, // Spread existing state
        values, // Override with new values
        message: null,
        situation: null
    };

    // Check CSRF token
    const csrfToken = formData.get(csrfInputName) as string;

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
        const fetchResponse = await loginAccount(validated.data);

        if (fetchResponse?.success && fetchResponse.data && 'token' in fetchResponse.data) {
            const authResponse = await createAuth(fetchResponse.data.token);

            if (authResponse?.success) {
                return {
                    ...result,
                    message: authResponse?.message || null,
                    situation: 'success'
                };
            } else {
                return {
                    ...result,
                    message: authResponse?.message || null,
                    situation: 'error'
                };
            }
        } else {
            return {
                ...result,
                message: fetchResponse?.message || null,
                situation: 'error'
            };
        }
    } catch (error: unknown) {
        let message: string = lang('login.message.could_not_login');
        let situation: LoginSituation = 'error';
        let responseBody: { authValidTokens: AuthTokenListType } | undefined = undefined;

        if (error instanceof ApiError) {
            switch (error.status) {
                case 429:
                    message = lang('login.message.too_many_login_attempts');
                    break;
                case 403:
                    message = lang('login.message.max_active_sessions');
                    situation = 'max_active_sessions';
                    responseBody = error.body?.data as { authValidTokens: AuthTokenListType }
                    break;
                case 406:
                    situation = 'success'; // Already logged in
                    break;
                case 400:
                    message = lang('login.message.not_active');
                    break;
            }
        }

        return {
            ...result,
            message: message,
            situation: situation,
            body: responseBody
        };
    }
}