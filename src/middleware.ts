import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import Routes, {RouteAuth, RouteMatch} from '@/config/routes';
import {appendSessionToken, forwardedHeaders, getSessionToken, removeSessionToken} from '@/lib/utils/system';
import {ApiRequest, getResponseData, ResponseFetch} from '@/lib/api';
import {AuthModel, hasPermission, prepareAuthModel} from '@/lib/models/auth.model';
import {lang} from '@/config/lang';
import {ApiError} from '@/lib/exceptions/api.error';
import {appendCsrfToken} from '@/lib/csrf';

// import {getRedisClient} from '@/config/init-redis.config';

function blockedOrigin(req: NextRequest) {
    const ALLOWED_ORIGIN = ['http://localhost:3000', 'http://nextjs.test'];

    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');

    // Probably a same-origin browser request — allow it
    if (!origin && !referer) {
        return false;
    }

    // Check origin header
    if (origin && ALLOWED_ORIGIN.includes(origin)) {
        return false; // Not blocked
    }

    // Check referer header
    if (referer) {
        try {
            const refererUrl = new URL(referer);
            const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;

            if (ALLOWED_ORIGIN.includes(refererOrigin)) {
                return false; // Not blocked
            }
        } catch {
            console.warn('Invalid referer URL:', referer);
        }
    }

    return true; // Blocked
}

/**
 * Redirect to the login page
 *
 * @param request
 */
function redirectToLogin(request: NextRequest) {
    const loginUrl = new URL(Routes.get('login'), request.url);

    // Create the full destination URL with all query params
    const currentUrl = new URL(request.url);
    const destinationPath = currentUrl.pathname + currentUrl.search;

    // URL-encode the full destination including query params
    loginUrl.searchParams.set('from', encodeURIComponent(destinationPath));

    const response = NextResponse.redirect(loginUrl);

    return appendCsrfToken(request, response);
}

/**
 * Redirect to the error page
 * The error message will be carried as a query param
 *
 * @param request
 * @param error
 */
function redirectToError(request: NextRequest, error: Error | string) {
    const redirectUrl = new URL(Routes.get('status', {type: 'error'}), request.url);

    if (error) {
        let logMessage: string;

        if (error instanceof Error) {
            logMessage = error.message;
        } else {
            logMessage = error;
        }

        redirectUrl.searchParams.set('msg', logMessage);
    }

    return NextResponse.redirect(redirectUrl);
}

/**
 * Returns a success response
 *
 * @returns
 */
function responseSuccess(request: NextRequest) {
    let response = NextResponse.next();

    response.headers.set('X-Content-Type-Options', 'nosniff');

    if (
        request.method === 'GET' &&
        !request.headers.get('X-Requested-With') &&
        request.headers.get('accept')?.includes('text/html')
    ) {
        response = appendCsrfToken(request, response);
    }

    // `unsafe-inline` will block inline scripts (eg: <script>alert()</script>)
    // `default-src 'self'; script-src 'self' will block any CSS, JS or images loaded from external sources
    // is good for security but some resources need to be whitelisted (ex: FontAwesome)
    // if (cfg('environment') === 'production') {
    //     response.headers.set(
    //         'Content-Security-Policy',
    //         "default-src 'self'; script-src 'self' 'unsafe-inline'"
    //     );
    // }

    return response;
}

/**
 * Extends a success response to an authorized response
 * It adds `x-auth-data` header & refreshes the session token
 *
 * @param request
 * @param sessionToken
 * @param authModel
 */
function responseAuthorized(request: NextRequest, sessionToken: string, authModel: AuthModel) {
    const response = responseSuccess(request);

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
//         await redis.expire(key, cfg('middleware.rate_limit_window'));
//     }
//
//     if (current > cfg('middleware.max_requests')) {
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
//     const response = redirectToError(req, lang('auth.message.unauthorized'));
//
//     return removeSessionToken(response);
// }

function handleMissingSession(req: NextRequest, routeAuth: RouteAuth | undefined): NextResponse {
    switch (routeAuth) {
        case RouteAuth.UNAUTHENTICATED:
        case RouteAuth.PUBLIC:
            return responseSuccess(req);
        case RouteAuth.AUTHENTICATED:
        case RouteAuth.PROTECTED:
            return redirectToLogin(req);
        default:
            return redirectToError(req, `Unknown route auth: ${routeAuth}`);
    }
}

/**
 * Fetches auth model
 * Note:
 *    - Do not throw errors from this method as it will break the middleware flow
 *    - Error will be logged only if the response status is not 401
 *
 * @param req
 * @param sessionToken
 */
async function fetchAuthModel(req: NextRequest, sessionToken: string): Promise<AuthModel> {
    try {
        const fetchResponse: ResponseFetch<AuthModel> = await new ApiRequest()
            .setRequestMode('remote-api')
            .doFetch('/account/details', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                    ...forwardedHeaders(req)
                }
            });

        if (fetchResponse?.success) {
            const responseData = getResponseData(fetchResponse);

            if (responseData) {
                return prepareAuthModel(responseData);
            }
        }

        return null;
    } catch (error: unknown) {
        if (error instanceof ApiError && error.status === 401) {
            return null;
        }

        return null;
    }
}

function handleInvalidAuth(req: NextRequest, routeAuth: RouteAuth | undefined): NextResponse {
    switch (routeAuth) {
        case RouteAuth.UNAUTHENTICATED:
        case RouteAuth.PUBLIC: {
            const response = responseSuccess(req);

            return removeSessionToken(response); // Session token exists but is invalid so it is removed
        }
        case RouteAuth.AUTHENTICATED:
        case RouteAuth.PROTECTED: {
            const msg = lang('auth.message.unauthorized');
            const response = redirectToError(req, msg);

            return removeSessionToken(response); // Session token exists but is invalid so it is removed
        }
        default: {
            const response = redirectToError(req, `Unknown route auth: ${routeAuth}`);

            return removeSessionToken(response);
        }
    }
}

async function handleAuthRequirement(req: NextRequest, routeMatch: RouteMatch | undefined): Promise<NextResponse> {
    const sessionToken = await getSessionToken();

    const {auth: routeAuth, permission: routePermission} = routeMatch?.props || {
        routeAuth: RouteAuth.PUBLIC, routePermission: undefined
    };

    if (!sessionToken) {
        return handleMissingSession(req, routeAuth);
    }

    const authModel = await fetchAuthModel(req, sessionToken);

    if (!authModel) {
        return handleInvalidAuth(req, routeAuth);
    }

    if (routeAuth === RouteAuth.UNAUTHENTICATED) {
        return redirectToError(req, lang('auth.message.already_logged_in'));
    }

    if (routeAuth === RouteAuth.PROTECTED) {
        if (!hasPermission(authModel, routePermission)) {
            return redirectToError(req, lang('auth.message.unauthorized'));
        }
    }

    return responseAuthorized(req, sessionToken, authModel);
}

export async function middleware(req: NextRequest) {
    // Allow preflight and HEAD requests unconditionally
    if (['HEAD', 'OPTIONS'].includes(req.method)) {
        return NextResponse.next();
    }

    // Block suspicious origins
    if (blockedOrigin(req)) {
        return new NextResponse('Forbidden', {status: 403});
    }

    // if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method) && !isValidCSRF(req)) {
    //     return redirectToError(req, lang('error.csrf'));
    // }

    // Match route
    const pathname = req.nextUrl.pathname;

    const routeMatch = Routes.match(pathname);

    if (!routeMatch) {
        return responseSuccess(req);
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

    return responseSuccess(req);
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|svg|css|js|json|woff2?|ttf|eot)).*)',
    ],
};