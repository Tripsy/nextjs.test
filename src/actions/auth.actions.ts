'use server';

import {ApiRequest, getResponseData, ResponseFetch} from '@/lib/api';
import {deleteCookie, getTrackedCookie, setupTrackedCookie} from '@/lib/utils/session';
import {cfg} from '@/config/settings';
import {lang} from '@/config/lang';
import {AuthModel, prepareAuthModel} from '@/lib/models/auth.model';
import {apiHeaders} from '@/lib/utils/system';
import {ApiError} from '@/lib/exceptions/api.error';

export async function createAuth(sessionToken: string): Promise<ResponseFetch<null>> {
    if (!sessionToken) {
        return {
            message: 'No token provided',
            success: false
        };
    }

    await setupTrackedCookie({
        action: 'set',
        name: cfg('user.sessionToken'),
        value: sessionToken
    }, {
        httpOnly: true,
        maxAge: Number(cfg('user.sessionMaxAge')),
    });

    return {
        message: lang('login.message.auth_success'),
        success: true
    };
}

export async function getAuth(): Promise<ResponseFetch<AuthModel>> {
    try {
        const sessionToken = await getTrackedCookie(cfg('user.sessionToken'));

        if (!sessionToken.value) {
            return {
                data: null,
                message: 'Could not retrieve auth model (eg: no session token)',
                success: false
            };
        }

        const fetchResponse: ResponseFetch<AuthModel> | undefined = await new ApiRequest()
            .setRequestMode('remote-api')
            .doFetch('/account/details', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${sessionToken.value}`,
                    ...await apiHeaders()
                }
            });

        if (fetchResponse?.success) {
            const responseData = getResponseData(fetchResponse);

            if (responseData) {
                const authModel = prepareAuthModel(responseData);
                
                await setupTrackedCookie(sessionToken, {
                    httpOnly: true,
                    maxAge: Number(cfg('user.sessionMaxAge')),
                });

                return {
                    data: authModel,
                    message: 'Ok',
                    success: true
                };
            }
        } else {
            await deleteCookie(cfg('user.sessionToken'));

            return {
                data: null,
                message: fetchResponse?.message || 'Could not retrieve auth model (eg: unknown error)',
                success: false
            };
        }
    } catch (error: unknown) {
        if (error instanceof ApiError && error.status === 401) {
            await deleteCookie(cfg('user.sessionToken'));
        }

        return {
            data: null,
            message: error instanceof Error ? error.message : 'Could not retrieve auth model (eg: unknown error)',
            success: false
        };
    }
}

export async function clearAuth(): Promise<ResponseFetch<null>> {
    await deleteCookie(cfg('user.sessionToken'));

    return {
        message: lang('logout.message.success'),
        success: true,
    };
}