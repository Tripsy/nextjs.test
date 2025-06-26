`use server`;

import {executeFrontendFetch, getResponseData, ResponseFetch} from '@/lib/api';
import {lang} from '@/config/lang';
import {cookies} from 'next/headers';

export async function createAuth(token: string): Promise<ResponseFetch<null>> {
    try {
        await executeFrontendFetch<ResponseFetch<null>>('auth', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token}),
        });

        return {
            message: lang('login.message.auth_success'),
            success: true,
        };
    } catch (error: unknown) {
        // TODO: Log error

        return {
            success: false,
            message: error instanceof Error ? lang('login.message.auth_error') : 'Network request failed',
        };
    }
}

export async function getAuth() {
    try {
        const response: ResponseFetch<{ token: string | null }> | undefined = await executeFrontendFetch('auth', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });

        if (response?.success) {
            return getResponseData<{token: string | null}>(response)?.token;
        }
    } catch (error: unknown) {
        // TODO: Log error
    }

    return null;
}

export async function getTokenFromCookie(): Promise<string | undefined> {
    const cookieStore = await cookies();

    return cookieStore.get('session')?.value;
}
