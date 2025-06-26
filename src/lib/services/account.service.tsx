`use server`;

import {executeBackendFetch, ResponseFetch} from '@/lib/api';
import {RegisterFormValues} from '@/app/account/register/register-form.definition';
import {LoginFormValues} from '@/app/account/login/login-form.definition';

export async function registerAccount(params: RegisterFormValues): Promise<any> {
    return await executeBackendFetch<ResponseFetch<any>>('/account/register', {
        method: 'POST',
        body: JSON.stringify(params),
    }, [409]);
}

export async function loginAccount(params: LoginFormValues): Promise<any> {
    return await executeBackendFetch<ResponseFetch<{token: string}>>('/account/login', {
        method: 'POST',
        body: JSON.stringify(params),
    });
}

export async function removeTokenAccount(token: string): Promise<any> {
    return await executeBackendFetch<ResponseFetch<null>>('/account/token', {
        method: 'DELETE',
        body: JSON.stringify({
            ident: token
        }),
    });
}