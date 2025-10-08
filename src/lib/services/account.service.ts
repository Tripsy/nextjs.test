import {ApiRequest, ResponseFetch} from '@/lib/api';
import {RegisterFormFieldsType} from '@/app/account/register/register.definition';
import {AuthTokenListType, LoginFormFieldsType} from '@/app/account/login/login.definition';
import {UserModel} from '@/lib/models/user.model';

export async function registerAccount(params: RegisterFormFieldsType): Promise<ResponseFetch<UserModel>> {
    return await new ApiRequest()
        .doFetch('/account/register', {
            method: 'POST',
            body: JSON.stringify(params),
        });
}

export async function loginAccount(params: LoginFormFieldsType): Promise<ResponseFetch<{token: string} | { authValidTokens: AuthTokenListType }>> {
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

export async function logoutAccount(): Promise<ResponseFetch<null>> {
    return await new ApiRequest()
        .doFetch('/account/logout', {
            method: 'DELETE'
        });
}