'use server';

import {getCookie} from '@/lib/utils/session';
import {cfg} from '@/config/settings';

export async function isValidCsrfToken(inputValue: string) {
    if (!inputValue) {
        return false;
    }

    const cookieValue = await getCookie(cfg('csrf.cookieName'));

    return cookieValue === inputValue;
}