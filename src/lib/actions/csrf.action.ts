'use server';

import { cfg } from '@/config/settings';
import {getCookie} from "@/lib/helpers/session";

export async function isValidCsrfToken(inputValue: string) {
	if (!inputValue) {
		return false;
	}

	const cookieValue = await getCookie(cfg('csrf.cookieName') as string);

	return cookieValue === inputValue;
}
