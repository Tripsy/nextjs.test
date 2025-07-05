import {ApiRequest, getResponseData, ResponseFetch} from '@/lib/api';
import {RegisterFormValues} from '@/app/account/register/register-form.definition';
import {LoginFormValues} from '@/app/account/login/login.definition';
import {lang} from '@/config/lang';
import {AuthModel} from '@/lib/models/auth.model';

export async function registerAccount(params: RegisterFormValues): Promise<any> {
    return await new ApiRequest()
        .setAcceptedErrorCodes([409])
        .doFetch('/account/register', {
            method: 'POST',
            body: JSON.stringify(params),
        });
}

export async function loginAccount(params: LoginFormValues): Promise<any> {
    return await new ApiRequest()
        .doFetch('/account/login', {
            method: 'POST',
            body: JSON.stringify(params),
        });
}

export async function removeTokenAccount(token: string): Promise<any> {
    return await new ApiRequest()
        .doFetch('/account/token', {
            method: 'DELETE',
            body: JSON.stringify({
                ident: token
            }),
        });
}

export async function createAuth(token: string): Promise<ResponseFetch<null>> {
    try {
        await new ApiRequest()
            .setRequestMode('same-site')
            .doFetch('auth', {
                method: 'POST',
                body: JSON.stringify({token}),
            });

        return {
            message: lang('login.message.auth_success'),
            success: true,
        };
    } catch (error: unknown) {
        console.error(error);

        return {
            success: false,
            message: error instanceof Error ? lang('login.message.auth_error') : 'Network request failed',
        };
    }
}

export async function getAuth(): Promise<AuthModel> {
    try {
        const fetchResponse: ResponseFetch<AuthModel> | undefined = await new ApiRequest()
            .setRequestMode('same-site')
            .doFetch('auth', {
                method: 'GET',
            });

        if (fetchResponse?.success) {
            return getResponseData(fetchResponse) || null;
        } else {
            console.error(fetchResponse?.message || 'Could not retrieve auth model (eg: request failed)');
        }
    } catch (error: unknown) {
        console.error(error);
    }

    return null;
}

export async function logoutAccount(): Promise<any> {
    return await new ApiRequest()
        .doFetch('/account/logout', {
            method: 'DELETE'
        });
}

export async function clearAuth(): Promise<ResponseFetch<null>> {
    try {
        await new ApiRequest()
            .setRequestMode('same-site')
            .doFetch('auth', {
                method: 'DELETE',
            });

        return {
            message: lang('logout.message.success'),
            success: true,
        };
    } catch (error: unknown) {
        console.error(error);

        return {
            success: false,
            message: error instanceof Error ? lang('logout.message.error') : 'Network request failed',
        };
    }
}