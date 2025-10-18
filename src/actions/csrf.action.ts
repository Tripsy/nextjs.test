'use server';

import { cfg } from '@/config/settings';
import { getCookie } from '@/lib/utils/session';

export async function isValidCsrfToken(inputValue: string) {
	if (!inputValue) {
		return false;
	}

	const cookieValue = await getCookie(cfg('csrf.cookieName'));

	return cookieValue === inputValue;
}
