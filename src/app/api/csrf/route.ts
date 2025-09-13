import {NextRequest, NextResponse} from 'next/server';
import {ResponseFetch} from '@/lib/api';
import {csrfCookieName, prepareCsrfToken, responseWithCsrfToken} from '@/lib/csrf';

type NextResponseCsrfToken = NextResponse<ResponseFetch<{
    csrfToken: string
}>>;

export async function GET(request: NextRequest): Promise<NextResponseCsrfToken> {
    try {
        const {csrfRefresh, csrfToken} = prepareCsrfToken(request);

        let response: NextResponseCsrfToken = NextResponse.json(
            {
                data: {csrfToken},
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
                    'Content-Type': 'application/json'
                }
            }
        );

        // Refresh CSRF cookie if needed
        if (csrfRefresh) {
            response = responseWithCsrfToken(response, csrfToken) as NextResponseCsrfToken;
        }

        return response;
    } catch {
        return NextResponse.json(
            {
                data: {
                    csrfToken: ''
                },
                success: false,
                message: 'Failed to generate CSRF token'
            },
            {
                status: 500,
                headers: {
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'Referrer-Policy': 'strict-origin-when-cross-origin',
                    'Cache-Control': 'no-store, max-age=0',
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}

export async function POST(request: NextRequest) {
    const cookieToken = request?.cookies.get(csrfCookieName)?.value;
    const requestToken = (await request.json())?.csrfToken;

    let success = true;

    if (!requestToken || !cookieToken || cookieToken !== requestToken) {
        success = false;
    }

    return NextResponse.json({
        success: success,
        message: success ? 'CSRF token valid' : 'Invalid CSRF token'
    });
}

export const dynamic = 'force-dynamic'; // Ensure this route is never statically optimize