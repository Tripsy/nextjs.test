import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import Routes, {RouteAuthRequirement} from '@/lib/routes';
import {forwardedHeaders, getSessionToken} from '@/lib/utils/system';
import {ApiRequest, getResponseData} from '@/lib/api';
import {normalizeDates} from '@/lib/utils/model';
import {AuthModel, isAdmin, isOperator} from '@/lib/models/auth.model';
import {app} from '@/config/settings';

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

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    const routeMatch = Routes.match(pathname);

    if (!routeMatch) {
        return NextResponse.next();
    }

    switch (routeMatch.props.authRequirement) {
        case RouteAuthRequirement.AUTHENTICATED:
        case RouteAuthRequirement.PROTECTED:
            const sessionToken = await getSessionToken();

            if (!sessionToken) {
                return redirectToLogin(req);
            }

            let authModel: AuthModel = null;

            const fetchResponse = await new ApiRequest()
                .setRequestMode('back-end')
                .doFetch('/account/details', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                        ...forwardedHeaders(req)
                    }
                });

            // TODO replace with try catch block
            if (fetchResponse?.success) {
                const responseData = getResponseData(fetchResponse);

                if (responseData) {
                    // TODO maybe include refresh session token here & caching. ..look for normalizeDates
                    authModel = normalizeDates(responseData) as AuthModel;
                } else {
                    return redirectToLogin(req);
                }
            } else {
                return redirectToLogin(req);
            }

            if (routeMatch.props.authRequirement === RouteAuthRequirement.PROTECTED) {
                if (!isAdmin(authModel) && !isOperator(authModel)) {
                    return NextResponse.redirect(
                        new URL(Routes.get('home'), req.url)
                    );
                }
            }
            return NextResponse.next();
        default:
            return NextResponse.next();
    }

    // // Example: Prevent authenticated users from accessing auth pages
    // if (routeMatch.name === 'login') {
    //     const isAuthenticated = checkAuth(request);
    //     if (isAuthenticated) {
    //         return NextResponse.redirect(new URL(Routes.get('dashboard'), request.url));
    //     }
    // }
    //
    // return NextResponse.next();

    // // 1. Check authentication
    // const sessionToken = await getSessionToken();
    //
    // if (!sessionToken) {
    //     // Redirect to login if not authenticated
    //     return NextResponse.redirect(new URL('/login', request.url));
    // }
    //
    // const authData = await getAuthData();
    //
    // if (!authData) {
    //     // Redirect to login if not authenticated
    //     return NextResponse.redirect(new URL('/login', request.url));
    // }
    //
    //
    //    - optional check role based on route
    // const verifiedToken = await verifyAuth(request).catch(() => {
    //     console.error('Invalid token');
    // });
    //
    // if (!verifiedToken) {
    //     // Redirect to login if not authenticated
    //     return NextResponse.redirect(new URL('/login', request.url));
    // }
    //
    // // 2. Role-based access control (optional)
    // if (request.nextUrl.pathname.startsWith('/admin') && verifiedToken.role !== 'admin') {
    //     return NextResponse.redirect(new URL('/unauthorized', request.url));
    // }
    //
    // // 3. Add security headers (optional)
    // const response = NextResponse.next();
    // response.headers.set('X-Content-Type-Options', 'nosniff');
    // return response;
}

// Specify which routes to protect
// TODO: consider to add exclusin (eg: css / json / js / etc) and let all the routes to be checked based on routes configuration
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/account/:path*',
    ]
};