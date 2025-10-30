function getCookieDomain(domain?: string): string {
	if (domain) {
		return domain;
	}

	const host = document.location.hostname;
	const parts = host.split('.');
	if (parts.length > 2) {
		return `.${parts.slice(-2).join('.')}`;
	}

	return `.${host}`;
}

export async function setCookie(
	name: string,
	value: string,
	expireSeconds = 86400,
	domain?: string,
): Promise<void> {
	const expires = Date.now() + expireSeconds * 1000;

	await cookieStore.set({
		name,
		value: encodeURIComponent(value || ''),
		expires,
		domain: getCookieDomain(domain),
		path: '/',
	});
}

export async function readCookie(name: string): Promise<string | null> {
	const cookie = await cookieStore.get(name);

	if (!cookie?.value) {
		return null;
	}

	return decodeURIComponent(cookie.value);
}

export async function removeCookie(name: string): Promise<void> {
	await cookieStore.delete(name);
}
