import {NextResponse} from 'next/server';
import {ResponseFetch} from '@/lib/api';
import {getTrackedCookie, getTrackedCookieName} from '@/lib/utils/session';
import {cfg} from '@/config/settings';
import {randomString} from '@/lib/utils/string';

type NextResponseCsrfToken = NextResponse<ResponseFetch<{
    csrfToken: string
}>>;

export async function GET(): Promise<NextResponseCsrfToken> {
    const cookieName = cfg('csrf.cookieName');

    const csrfToken = await getTrackedCookie(cookieName);

    if (!csrfToken.value) {
        csrfToken.value = randomString();
    }

    const response: NextResponseCsrfToken = NextResponse.json(
        {
            data: {
                csrfToken: csrfToken.value
            },
            success: true,
            message: ''
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
                'Cross-Origin-Embedder-Policy': 'require-corp'
            }
        }
    );

    if (csrfToken.action === 'set') {
        const cookieMaxAge = Number(cfg('csrf.cookieMaxAge'));

        response.cookies.set(cookieName, csrfToken.value, {
            httpOnly: true,
            secure: cfg('environment') === 'production',
            path: '/',
            sameSite: 'lax',
            maxAge: cookieMaxAge
        });

        const cookieExpireValue = Date.now() + (cookieMaxAge * 1000);

        response.cookies.set(getTrackedCookieName(cookieName), String(cookieExpireValue), {
            httpOnly: true,
            secure: cfg('environment') === 'production',
            path: '/',
            sameSite: 'lax',
            maxAge: cookieMaxAge
        });
    }

    return response;
}

export const dynamic = 'force-dynamic'; // Ensure this route is never statically optimize