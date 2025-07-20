import {randomString} from '@/lib/utils/string';
import {cookies} from 'next/headers';
import {cfg} from '@/config/settings';
import {NextRequest, NextResponse} from 'next/server';

const csrfCookieName = 'x-csrf-secret';
const csrfInputName = 'x-csrf-token';
const csrfMaxAge = 60 * 60;

export function appendCSRF(request: NextRequest, response: NextResponse): NextResponse {
    const existingToken = request?.cookies.get(csrfCookieName)?.value;
    const cookieSetTime = parseInt(request.cookies.get(`${csrfCookieName}-set-time`)?.value || '0');

    // Calculate token age
    const tokenAge = Date.now() - cookieSetTime;
    const timeRemaining = (csrfMaxAge * 1000) - tokenAge;
    const needsRefresh = !existingToken || timeRemaining < 15 * 60 * 1000; // Refresh if less than 15 minutes remaining;

    if (needsRefresh) {
        console.log('token refreshed')
        const csrfToken = existingToken || randomString('uuid');

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
    }


    return response;
}

async function getCSRFToken(): Promise<string | undefined> {
    const cookieStore = await cookies();

    const token = cookieStore.get(csrfCookieName);

    return token?.value;
}

export async function csrf() {
    const csrfToken = await getCSRFToken();

    // TODO if csrfToken is not present make a GET request to create a token (like in middleware)

    return (
        <input type="hidden" name={csrfInputName} value={csrfToken} />
    );
}

//
// /**
//  * Checks if the CSRF token is valid
//  *
//  * @param req
//  */
// export function isValidCSRF(req: NextRequest): boolean {
//     const headerToken = req.headers.get('X-CSRF-Token');
//     const cookieToken = req.cookies.get(csrfCookieName)?.value || '';
//
//     return headerToken === cookieToken;
// }