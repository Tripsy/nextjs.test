import {ApiRequest, getResponseData, ResponseFetch} from '@/lib/api';
import {RegisterFormValues} from '@/app/account/register/register.definition';
import {AuthTokenListType, LoginFormValues} from '@/app/account/login/login.definition';
import {lang} from '@/config/lang';
import {AuthModel} from '@/lib/models/auth.model';
import {ApiError} from '@/lib/exceptions/api.error';
import {UserModel} from '@/lib/models/user.model';

export async function registerAccount(params: RegisterFormValues): Promise<ResponseFetch<UserModel>> {
    return await new ApiRequest()
        .doFetch('/account/register', {
            method: 'POST',
            body: JSON.stringify(params),
        });
}

export async function loginAccount(params: LoginFormValues): Promise<ResponseFetch<{token: string} | { authValidTokens: AuthTokenListType }>> {
    return await new ApiRequest()
        .doFetch('/account/login', {
            method: 'POST',
            body: JSON.stringify(params),
        });
}

export async function removeTokenAccount(token: string): Promise<ResponseFetch<null>> {
    return await new ApiRequest()
        .doFetch('/account/token', {
            method: 'DELETE',
            body: JSON.stringify({
                ident: token
            }),
        });
}

export async function createAuth(token: string): Promise<ResponseFetch<null>> {
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
}

export async function getAuth(source: string = 'same-site', sessionToken?: string): Promise<AuthModel> {
    try {
        let fetchResponse: ResponseFetch<AuthModel>;

        if (source === 'same-site') {
            fetchResponse = await new ApiRequest()
                .setRequestMode('same-site')
                .doFetch('auth', {
                    method: 'GET',
                });
        } else {
            fetchResponse = await new ApiRequest()
                .setRequestMode('remote-api')
                .doFetch('/account/details', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                    }
                });
        }

        if (fetchResponse?.success) {
            return getResponseData(fetchResponse) || null;
        } else {
            console.warn(fetchResponse?.message || 'Could not retrieve auth model (eg: request failed)');
        }

        return null;
    } catch (error: unknown) {
        if (error instanceof ApiError && error.status === 401) {
            console.warn('Authentication expired', error);
        } else {
            console.error('Failed to fetch auth', error);
        }

        return null;
    }
}

export async function logoutAccount(): Promise<ResponseFetch<null>> {
    return await new ApiRequest()
        .doFetch('/account/logout', {
            method: 'DELETE'
        });
}

export async function clearAuth(): Promise<ResponseFetch<null>> {
    try {
        const fetchResponse = await new ApiRequest()
            .setRequestMode('same-site')
            .doFetch<null>('auth', {
                method: 'DELETE',
            });

        return {
            message:  fetchResponse?.message || lang('logout.message.success'),
            success: true,
        };
    } catch (error: unknown) {
        console.error('Logout failed:', error);

        let message: string = lang('logout.message.error') || 'An error occurred during logout.';

        if (error instanceof Error) {
            message = error.message;
        }

        return {
            success: false,
            message: message,
        };
    }
}