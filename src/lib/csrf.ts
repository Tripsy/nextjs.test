import {randomString} from '@/lib/utils/string';
import {cfg} from '@/config/settings';
import {NextRequest, NextResponse} from 'next/server';
import {ApiRequest} from '@/lib/api';

export const csrfCookieName = 'x-csrf-secret';
export const csrfInputName = 'x-csrf-token';
const csrfMaxAge = 60 * 60;

export function prepareCsrfToken(request: NextRequest): {csrfRefresh: boolean, csrfToken: string} {
    const existingToken = request?.cookies.get(csrfCookieName)?.value;
    const cookieSetTime = parseInt(request.cookies.get(`${csrfCookieName}-set-time`)?.value || '0');

    // Calculate token age
    const tokenAge = Date.now() - cookieSetTime;
    const timeRemaining = (csrfMaxAge * 1000) - tokenAge;
    const csrfRefresh = !existingToken || timeRemaining < 15 * 60 * 1000; // Refresh if less than 15 minutes remaining;

    return {
        csrfRefresh: csrfRefresh,
        csrfToken: existingToken || randomString()
    }
}

export function responseWithCsrfToken(response: NextResponse, csrfToken: string): NextResponse {
    response.cookies.set(csrfCookieName, csrfToken, {
        httpOnly: true,
        secure: cfg('environment') === 'production',
        path: '/',
        sameSite: 'lax',
        maxAge: csrfMaxAge,
        priority: 'high'
    });

    // Store when we set this token
    const now = Date.now();

    response.cookies.set(`${csrfCookieName}-set-time`, now.toString(), {
        httpOnly: true,
        secure: cfg('environment') === 'production',
        path: '/',
        sameSite: 'lax',
        maxAge: csrfMaxAge
    });

    return response;
}

export function appendCsrfToken(request: NextRequest, response: NextResponse): NextResponse
{
    const {csrfRefresh, csrfToken} = prepareCsrfToken(request);

    if (csrfRefresh) {
        response = responseWithCsrfToken(response, csrfToken);
    }

    return response;
}

export async function fetchCsrfToken() {
    try {
        const result = await new ApiRequest()
            .setRequestMode('same-site')
            .doFetch<{csrfToken: string}>('csrf', {
                method: 'GET'
            });

        return result?.data?.csrfToken;
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);

        return undefined;
    }
}

export async function isValidCsrfToken(csrfToken: string): Promise<boolean> {
    try {
        const result = await new ApiRequest()
            .setRequestMode('same-site')
            .doFetch('csrf', {
                method: 'POST',
                body: JSON.stringify({
                    csrfToken
                }),
            });

        if (result?.success) {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Failed to check CSRF token:', error);

        return false;
    }
}