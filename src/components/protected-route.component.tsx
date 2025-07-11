'use client';

import {useAuth} from '@/providers/auth.provider';
import React, {useEffect, useMemo} from 'react';
import Routes, {RouteAuth} from '@/config/routes';
import {Notice} from '@/components/notice.component';
import {hasPermission} from '@/lib/models/auth.model';
import {usePathname, useRouter} from 'next/navigation';
import {lang} from '@/config/lang';

type ProtectedRouteProps = {
    children: React.ReactNode;
    routeAuth: RouteAuth;
    permission?: string;
    className?: string;
    fallback?: React.ReactNode;
}

const ProtectedRouteWrapper = ({children, className}: { children: React.ReactNode, className?: string }) => {
    return <div className={className}>{children}</div>;
};

export default function ProtectedRoute({children, routeAuth, permission, className, fallback}: ProtectedRouteProps) {
    const {auth, loadingAuth} = useAuth();

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loadingAuth && [RouteAuth.AUTHENTICATED, RouteAuth.PROTECTED].includes(routeAuth) && !auth) {
            router.push(`${Routes.get('login')}?from=${encodeURIComponent(pathname)}`);
        }
    }, [auth, loadingAuth, routeAuth]);

    if (routeAuth === RouteAuth.PUBLIC) {
        return <>{children}</>;
    }

    const validRouteAuth = useMemo(() => new Set(['authenticated', 'protected', 'unauthenticated']), []);

    if (!validRouteAuth.has(routeAuth)) {
        return (
            <ProtectedRouteWrapper className={className}>
                <Notice type="error" message="Implementation error">{fallback}</Notice>
            </ProtectedRouteWrapper>
        );
    }

    if (loadingAuth) {
        return (
            <ProtectedRouteWrapper className={className}>
                <Notice type="loading">{fallback}</Notice>
            </ProtectedRouteWrapper>
        );
    }

    if (auth && routeAuth === RouteAuth.UNAUTHENTICATED) {
        // TODO add a navigate to home page in the fallback OR better do a redirect
        return (
            <ProtectedRouteWrapper className={className}>
                <Notice type="warning" message={lang('auth.message.already_logged_in')}>{fallback}</Notice>
            </ProtectedRouteWrapper>
        );
    }

    if (auth && routeAuth === RouteAuth.PROTECTED && permission && !hasPermission(auth, permission)) {
        return (
            <ProtectedRouteWrapper className={className}>
                <Notice type="warning" message={lang('auth.message.unauthorized')}>{fallback}</Notice>
            </ProtectedRouteWrapper>
        );
    }

    return <>{children}</>;
}