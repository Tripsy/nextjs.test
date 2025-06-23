import {doFetch} from '@/lib/api';
import {RegisterFormValues} from '@/app/account/register/register-form.definition';

export async function registerAccount(params: RegisterFormValues): Promise<any> {
    return await doFetch('/account/register', {
        method: 'POST',
        body: JSON.stringify(params),
    });
}