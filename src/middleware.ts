import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import Routes, {RouteAuth, RouteMatch} from '@/config/routes';
import {appendSessionToken, forwardedHeaders, getSessionToken, removeSessionToken} from '@/lib/utils/system';
import {ApiRequest, ResponseFetch} from '@/lib/api';
import {AuthModel, handleAuthResponse, hasPermission} from '@/lib/models/auth.model';
import {lang} from '@/config/lang';

// import {getRedisClient} from '@/config/init-redis.config';

function redirectToLogin(req: NextRequest) {
    const loginUrl = new URL(Routes.get('login'), req.url);

    if (![
        Routes.get('login'),
        Routes.get('register'),
        Routes.get('logout'),
    ].includes(req.nextUrl.pathname)) {
        loginUrl.searchParams.set('from', req.nextUrl.pathname);
    } // TODO: include URLs which should not be redirected back after login

    return NextResponse.redirect(loginUrl);
}

function responseError(req: NextRequest, error: Error | string) {
    if (error) {
        let logMessage: string;

        if (error instanceof Error) {
            logMessage = error.message;
        } else {
            logMessage = error;
        }

        console.error(`[Middleware Error] ${req.nextUrl.pathname} →`, logMessage);
    }

    return NextResponse.redirect(
        new URL(Routes.get('home'), req.url) // TODO: maybe redirect to a custom error page
    );
}

function responseOk() {
    const response = NextResponse.next();

    response.headers.set('X-Content-Type-Options', 'nosniff');

    // `unsafe-inline` will block inline scripts (eg: <script>alert()</script>)
    // `default-src 'self'; script-src 'self' will block any CSS, JS or images loaded from external sources
    // is good for security but some resources need to be whitelisted (ex: FontAwesome)
    // if (app('environment') === 'production') {
    //     response.headers.set(
    //         'Content-Security-Policy',
    //         "default-src 'self'; script-src 'self' 'unsafe-inline'"
    //     );
    // }

    return response;
}

function responseAuthorized(sessionToken: string, authModel: AuthModel) {
    const response = responseOk();

    // Set auth data as a header
    response.headers.set(
        'x-auth-data',
        JSON.stringify(authModel)
    );

    return appendSessionToken(response, sessionToken); // This will actually refresh the session token
}

// /**
//  * This won't work because of the use of Redis in the middleware
//  *
//  * https://www.davidtran.dev/blogs/nextjs-middleware-full-nodejs-access
//  * https://nextjs.org/blog/next-15-2#nodejs-middleware-experimental
//  *
//  * @param req
//  */
// async function rateLimit(req: NextRequest) {
//     const redis = getRedisClient();
//     const clientIp = getClientIp(req) || 'xxx.xxx.xxx.xxx';
//
//     const key = `rate-limit:${clientIp}`;
//     const current = await redis.incr(key);
//
//     if (current === 1) {
//         await redis.expire(key, app('middleware.rate_limit_window'));
//     }
//
//     if (current > app('middleware.max_requests')) {
//         const ttl = await redis.ttl(key);
//
//         return {
//             isAllowed: false, retryAfter: ttl
//         };
//     }
//
//     return {
//         isAllowed: true
//     };
// }

// async function handleInvalidSession(req: NextRequest): Promise<NextResponse> {
//     const response = responseError(req, lang('auth.message.unauthorized'));
//
//     return removeSessionToken(response);
// }

function handleMissingSession(req: NextRequest, routeAuth: RouteAuth | undefined): NextResponse {
    switch (routeAuth) {
        case RouteAuth.UNAUTHENTICATED:
        case RouteAuth.PUBLIC:
            return responseOk();
        case RouteAuth.AUTHENTICATED:
        case RouteAuth.PROTECTED:
            return redirectToLogin(req);
        default:
            return responseError(req, `Unknown route auth: ${routeAuth}`);
    }
}

async function fetchAuthModel(req: NextRequest, sessionToken: string): Promise<AuthModel> {
    const fetchResponse: ResponseFetch<AuthModel> | undefined = await new ApiRequest()
        .setRequestMode('remote-api')
        .setAcceptedErrorCodes([401])
        .doFetch('/account/details', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                ...forwardedHeaders(req)
            }
        });

    return handleAuthResponse(fetchResponse);
}

function handleInvalidAuth(req: NextRequest, routeAuth: RouteAuth | undefined): NextResponse {
    switch (routeAuth) {
        case RouteAuth.UNAUTHENTICATED:
        case RouteAuth.PUBLIC: {
            const response = responseOk();

            return removeSessionToken(response); // Session token exists but is invalid so it is removed
        }
        case RouteAuth.AUTHENTICATED:
        case RouteAuth.PROTECTED: {
            const msg = lang('auth.message.unauthorized');
            const response = responseError(req, msg);

            return removeSessionToken(response); // Session token exists but is invalid so it is removed
        }
        default: {
            const response = responseError(req, `Unknown route auth: ${routeAuth}`);

            return removeSessionToken(response);
        }
    }
}

async function handleAuthRequirement(req: NextRequest, routeMatch: RouteMatch | undefined): Promise<NextResponse> {
    // 1. Get session token
    const sessionToken = await getSessionToken();

    const { auth: routeAuth, permission: routePermission } = routeMatch?.props || {
        routeAuth: RouteAuth.PUBLIC, routePermission: undefined
    };

    // 2. Check for missing session token
    if (!sessionToken) {
        return handleMissingSession(req, routeAuth);
    }

    // 3. Handle auth
    try {
        // 3.1. Fetch auth model
        const authModel = await fetchAuthModel(req, sessionToken);

        // 3.2. Handle invalid auth model
        if (!authModel) {
            return handleInvalidAuth(req, routeAuth);
        }

        // 3.3. Check route permission
        if (routeAuth === RouteAuth.PROTECTED) {
            if (!hasPermission(authModel, routePermission)) {
                return responseError(req, lang('auth.message.unauthorized'));
            }
        }

        // 3.4. Create successful response
        return responseAuthorized(sessionToken, authModel);
    } catch (error) {
        // 3.5. Return error
        return responseError(req, error instanceof Error ? error.message : 'Could not retrieve auth model (eg: unknown error)');
    }
}

export async function middleware(req: NextRequest) {
    // Match route
    const pathname = req.nextUrl.pathname;

    const routeMatch = Routes.match(pathname);

    if (!routeMatch) {
        return responseOk();
    }

    // // Rate limit
    // const {isAllowed, retryAfter} = await rateLimit(req);
    //
    // if (!isAllowed) {
    //     return new NextResponse(
    //         JSON.stringify({error: 'Too many requests. Please try again later.'}),
    //         {
    //             status: 429,
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Retry-After': String(retryAfter),
    //             },
    //         }
    //     );
    // }

    // Skip auth check for proxy routes - they will fail at remote API if is the case
    if (!['proxy', 'auth'].includes(routeMatch.name)) {
        return await handleAuthRequirement(req, routeMatch);
    }

    return responseOk();
}

const EXCLUDE_STATICS = [
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
    // runtime: 'nodejs', // default is edge; lack of support for Redis is not resolved by uncommenting this at the moment
};