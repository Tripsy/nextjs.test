import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import Routes, {RouteAuthRequirement, RouteMatch} from '@/lib/routes';
import {forwardedHeaders, getClientIp, getSessionToken} from '@/lib/utils/system';
import {ApiRequest, ResponseFetch} from '@/lib/api';
import {AuthModel, handleAuthResponse, isAdmin, isOperator} from '@/lib/models/auth.model';
import {app} from '@/config/settings';
import {ApiError} from '@/lib/exceptions/api.error';
import {getRedisClient} from '@/config/init-redis.config';

function redirectToLogin(req: NextRequest) {
    const response = NextResponse.redirect(
        new URL(Routes.get('login'), req.url) // absolute URL
    );

    // Set the cookie to remember where the user was going
    response.cookies.set(app('user.sessionLoginRedirect'), req.nextUrl.href, {
        httpOnly: false,
        secure: app('environment') === 'production',
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hour
    });

    return response;
}

function handleMiddlewareError(req: NextRequest, error: Error | string) {
    if (error) {
        let logMessage: string;

        if (error instanceof Error) {
            logMessage = error.message;
        } else {
            logMessage = error;
        }

        // TODO: log error
        console.error(`[Middleware Error] ${req.nextUrl.pathname} →`, logMessage);
    }

    return NextResponse.redirect(
        new URL(Routes.get('home'), req.url) // TODO: maybe redirect to a custom error page
    );
}

function handleMiddlewareResponse() {
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');

    return response;
}

async function rateLimit(req: NextRequest) {
    const redis = getRedisClient();
    const key = `rate-limit:${getClientIp(req)}`;
    const current = await redis.incr(key);

    if (current === 1) {
        await redis.expire(key, app('middleware.rate_limit_window'));
    }

    if (current > app('middleware.max_requests')) {
        const ttl = await redis.ttl(key);

        return {
            isAllowed: false, retryAfter: ttl
        };
    }

    return {
        isAllowed: true
    };
}

async function handleAuthRequirement(req: NextRequest, routeMatch: RouteMatch): Promise<NextResponse | undefined> {
    switch (routeMatch?.props.authRequirement) {
        case RouteAuthRequirement.AUTHENTICATED:
        case RouteAuthRequirement.PROTECTED:
            const sessionToken = await getSessionToken();

            if (!sessionToken) {
                return redirectToLogin(req);
            }

            try {
                const fetchResponse: ResponseFetch<AuthModel> | undefined = await new ApiRequest()
                    .setRequestMode('back-end')
                    .doFetch('/account/details', {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${sessionToken}`,
                            ...forwardedHeaders(req)
                        }
                    });

                const authModel = handleAuthResponse(fetchResponse);

                if (routeMatch.props.authRequirement === RouteAuthRequirement.PROTECTED) {
                    if (!isAdmin(authModel) && !isOperator(authModel)) {
                        return NextResponse.redirect(
                            new URL(Routes.get('home'), req.url)
                        );
                    }
                }
            } catch (error: unknown) {
                if (error instanceof ApiError) {
                    if ([401, 404].includes(error.status)) {
                        return redirectToLogin(req);
                    }
                }

                return handleMiddlewareError(req, error instanceof Error ? error.message : 'Could not retrieve auth model (eg: unknown error)');
            }
            break;
    }

    return undefined;
}

export async function middleware(req: NextRequest) {
    // Match route
    const pathname = req.nextUrl.pathname;

    const routeMatch = Routes.match(pathname);

    if (!routeMatch) {
        return handleMiddlewareResponse();
    }

    // Rate limit
    const {isAllowed, retryAfter} = await rateLimit(req);

    if (!isAllowed) {
        return new NextResponse(
            JSON.stringify({error: 'Too many requests. Please try again later.'}),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': String(retryAfter),
                },
            }
        );
    }

    if (['proxy'].includes(routeMatch.name)) {
        const authResponse = await handleAuthRequirement(req, routeMatch);

        if (authResponse) {
            return authResponse;
        }
    }

    return handleMiddlewareResponse();
}

const EXCLUDE_STATICS = [
    'api',
    '_next',
    'favicon.ico',
    'robots.txt',
    '.*\\.(?:ico|png|jpg|jpeg|svg|css|js|json|woff2?|ttf|eot)'
];

export const config = {
    matcher: [
        `/((?!${EXCLUDE_STATICS.join('|')}).*)`, // Exclude static assets and special files
        // '/api/:path*', // Exclude all API routes (note: they are skipped in the middleware; if we keep the exclusion here the rate limit will not trigger)
    ],
};