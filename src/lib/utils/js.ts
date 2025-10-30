function getCookieDomainPart(domain?: string) {
	if (domain) {
		return `;domain=${domain}`;
	}

	return `;domain=.${document.location.host}`;
}

export const setCookie = (
	name: string,
	value: string,
	expireSeconds: number = 86400,
	domain?: string,
) => {
	let expires = '';

	if (expireSeconds) {
		const date = new Date();

		date.setTime(date.getTime() + expireSeconds * 1000);

		expires = `; expires=${date.toUTCString()}`;
	}

	document.cookie =
		`${name}=${encodeURIComponent(value || '')}` +
		`${expires}` +
		`${getCookieDomainPart(domain)};path=/`;

	return;
};

export const readCookie = (name: string): string | null => {
	const cookieValue = document.cookie
		.split('; ')
		.find((row) => row.startsWith(`${name}=`))
		?.split('=')[1];

	if (cookieValue) {
		return decodeURIComponent(cookieValue);
	}

	return null;
};

export const removeCookie = (name: string, domain?: string) => {
	document.cookie =
		name +
		`=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${getCookieDomainPart(domain)}`;
};
