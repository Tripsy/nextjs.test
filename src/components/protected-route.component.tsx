'use client';

import {useAuth} from '@/providers/auth.provider';
import React, {useEffect, useMemo} from 'react';
import Routes, {RouteAuth} from '@/config/routes';
import {Notice} from '@/components/notice.component';
import {hasPermission} from '@/lib/models/auth.model';
import {usePathname, useRouter} from 'next/navigation';
import {lang} from '@/config/lang';
import {Loading} from '@/components/loading.component';

type ProtectedRouteProps = {
    children: React.ReactNode;
    routeAuth: RouteAuth;
    routePermission?: string;
    className?: string;
    fallback?: React.ReactNode;
}

const ProtectedRouteWrapper = ({children, className}: { children: React.ReactNode, className?: string }) => {
    return <div className={className}>{children}</div>;
};

export default function ProtectedRoute({children, routeAuth, routePermission, className, fallback}: ProtectedRouteProps) {
    const {authStatus, auth} = useAuth();

    const router = useRouter();
    const pathname = usePathname();

    // Redirect to login page if not authenticated and route is protected or authenticated
    useEffect(() => {
        if ([RouteAuth.AUTHENTICATED, RouteAuth.PROTECTED].includes(routeAuth) && authStatus === 'unauthenticated') {
            router.push(`${Routes.get('login')}?from=${encodeURIComponent(pathname)}`);
        }
    }, [authStatus, pathname, routeAuth, router]);

    const permission = useMemo(() => {
        if (routePermission) {
            return routePermission;
        }

        if (routeAuth === RouteAuth.PROTECTED && authStatus === 'authenticated') {
            return Routes.match(pathname)?.props?.permission;
        }

        return undefined;
    }, [routePermission, routeAuth, authStatus, pathname]);

    // Is a public route so return content
    if (routeAuth === RouteAuth.PUBLIC) {
        return <>{children}</>;
    }

    // Loading
    if (authStatus === 'loading') {
        return <Loading/>;
    }

    if (routeAuth === RouteAuth.UNAUTHENTICATED && authStatus === 'authenticated') {
        return (
            <ProtectedRouteWrapper className={className}>
                <Notice type="warning" message={lang('auth.message.already_logged_in')}>{fallback}</Notice>
            </ProtectedRouteWrapper>
        );
    }

    // If this is a protected route and the user doesn't have the required permission
    if (routeAuth === RouteAuth.PROTECTED && !hasPermission(auth, permission)) {
        return (
            <ProtectedRouteWrapper className={className}>
                <Notice type="warning" message={lang('auth.message.unauthorized')}>{fallback}</Notice>
            </ProtectedRouteWrapper>
        );
    }

    return <>{children}</>;
}