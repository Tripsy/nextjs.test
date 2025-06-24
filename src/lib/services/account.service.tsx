import {doFetch} from '@/lib/api';
import {RegisterFormValues} from '@/app/account/register/register-form.definition';
import {LoginFormValues} from '@/app/account/login/login-form.definition';

export async function registerAccount(params: RegisterFormValues): Promise<any> {
    return await doFetch('/account/register', {
        method: 'POST',
        body: JSON.stringify(params),
    }, [409]);
}

export async function loginAccount(params: LoginFormValues): Promise<any> {
    return await doFetch('/account/login', {
        method: 'POST',
        body: JSON.stringify(params),
    });
}