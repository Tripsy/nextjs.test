import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import Routes, {RouteAuthRequirement, RouteMatch} from '@/lib/routes';
import {appendSessionToken, forwardedHeaders, getSessionToken} from '@/lib/utils/system';
import {ApiRequest, ResponseFetch} from '@/lib/api';
import {AuthModel, handleAuthResponse, isAdmin, isOperator} from '@/lib/models/auth.model';
import {app} from '@/config/settings';
import {ApiError} from '@/lib/exceptions/api.error';
// import {getRedisClient} from '@/config/init-redis.config';

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

async function handleAuthRequirement(req: NextRequest, routeMatch: RouteMatch): Promise<NextResponse> {
    switch (routeMatch?.props.authRequirement) {
        case RouteAuthRequirement.AUTHENTICATED:
        case RouteAuthRequirement.PROTECTED:
            const sessionToken = await getSessionToken();

            if (!sessionToken) {
                return redirectToLogin(req);
            }

            try {
                const fetchResponse: ResponseFetch<AuthModel> | undefined = await new ApiRequest()
                    .setRequestMode('remote-api')
                    .doFetch('/account/details', {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${sessionToken}`,
                            ...forwardedHeaders(req)
                        }
                    });

                const authModel = handleAuthResponse(fetchResponse);

                // TODO : delete session token if auth model is null
                
                if (routeMatch.props.authRequirement === RouteAuthRequirement.PROTECTED) {
                    // TODO check permissions here
                    if (!isAdmin(authModel) && !isOperator(authModel)) {
                        return NextResponse.redirect(
                            new URL(Routes.get('home'), req.url)
                        );
                    }
                }

                const response = responseOk();

                return appendSessionToken(response, sessionToken); // This will actually refresh the session token                
            } catch (error: unknown) {
                if (error instanceof ApiError) {
                    if ([401, 404].includes(error.status)) {
                        return redirectToLogin(req);
                    }
                }

                return responseError(req, error instanceof Error ? error.message : 'Could not retrieve auth model (eg: unknown error)');
            }
    }

    return responseOk();
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
    if (!['proxy'].includes(routeMatch.name)) {
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