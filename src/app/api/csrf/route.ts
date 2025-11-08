import { NextResponse } from 'next/server';
import { cfg } from '@/config/settings';
import type { ResponseFetch } from '@/lib/utils/api';
import { getTrackedCookie, getTrackedCookieName } from '@/lib/utils/session';
import { randomString } from '@/lib/utils/string';

type NextResponseCsrf = NextResponse<
	ResponseFetch<{
		csrfToken: string;
	}>
>;

export async function GET(): Promise<NextResponseCsrf> {
	const cookieName = cfg('csrf.cookieName') as string;

	const csrfToken = await getTrackedCookie(cookieName);

	if (!csrfToken.value) {
		csrfToken.value = randomString();
	}

	const response: NextResponseCsrf = NextResponse.json(
		{
			data: {
				csrfToken: csrfToken.value,
			},
			success: true,
			message: '',
		},
		{
			status: 200,
			headers: {
				'X-Content-Type-Options': 'nosniff',
				'X-Frame-Options': 'DENY',
				'Referrer-Policy': 'strict-origin-when-cross-origin',
				'Cache-Control': 'no-store, max-age=0',
				'Content-Type': 'application/json',
				'Cross-Origin-Resource-Policy': 'same-origin',
				'Cross-Origin-Opener-Policy': 'same-origin',
				'Cross-Origin-Embedder-Policy': 'require-corp',
			},
		},
	);

	if (csrfToken.action === 'set') {
		const cookieMaxAge = cfg('csrf.cookieMaxAge') as number;

		response.cookies.set(cookieName, csrfToken.value, {
			httpOnly: true,
			secure: cfg('app.environment') === 'production',
			path: '/',
			sameSite: 'lax',
			maxAge: cookieMaxAge,
		});

		const cookieExpireValue = Date.now() + cookieMaxAge * 1000;

		response.cookies.set(
			getTrackedCookieName(cookieName),
			String(cookieExpireValue),
			{
				httpOnly: true,
				secure: cfg('app.environment') === 'production',
				path: '/',
				sameSite: 'lax',
				maxAge: cookieMaxAge,
			},
		);
	}

	return response;
}

export const dynamic = 'force-dynamic'; // Ensure this route is never statically optimize
