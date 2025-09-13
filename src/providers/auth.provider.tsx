'use client';

import React, {createContext, useState, ReactNode, useContext, useEffect, useMemo} from 'react';
import {AuthModel} from '@/lib/models/auth.model';
import {getAuth} from '@/lib/services/account.service';
import {isExcludedRoute} from '@/config/routes';
import {usePathname} from 'next/navigation';
import {ApiError} from '@/lib/exceptions/api.error';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

type AuthContextType = {
    auth: AuthModel;
    setAuth: (model: AuthModel) => void;
    authStatus: AuthStatus;
    setAuthStatus: (status: AuthStatus) => void;
    refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

const AuthProvider = ({children, initAuth = null}: { children: ReactNode, initAuth?: AuthModel }) => {
    const [auth, setAuth] = useState<AuthModel>(initAuth);
    const [authStatus, setAuthStatus] = useState<AuthStatus>(initAuth ? 'authenticated' : 'loading');
    const [authLastRefresh, setAuthLastRefresh] = useState<number | null>(null);

    const pathname = usePathname();

    const disableRefresh = useMemo(() => {
        return isExcludedRoute(pathname);
    }, [pathname]);

    const refreshAuth = async () => {
        try {
            const authResponse = await getAuth('same-site');

            const authData = authResponse?.success && authResponse?.data ? authResponse?.data : null;

            setAuth(authData);
            setAuthLastRefresh(Date.now());

            if (authData) {
                setAuthStatus('authenticated');
            } else {
                setAuthStatus('unauthenticated');
            }
        } catch (error: unknown) {
            if (error instanceof ApiError && error.status === 401) {
                setAuthStatus('unauthenticated');
                setAuthLastRefresh(Date.now());
            } else {
                setAuthStatus('error');
            }
        }
    };

    useEffect(() => {
        // Initial fetch if no initAuth provided
        if (!initAuth) {
            (async () => {
                await refreshAuth();
            })();
        } else {
            setAuthLastRefresh(Date.now());
        }
    }, [initAuth]);

    useEffect(() => {
        // Don't refresh if disabled - based on excluded auth routes
        if (disableRefresh) {
            return;
        }

        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible') {
                // Refresh if it's been more than REFRESH_INTERVAL since last refresh
                if (authLastRefresh && Date.now() - authLastRefresh > REFRESH_INTERVAL) {
                    await refreshAuth();
                }
            }
        };

        const intervalId = setInterval(async () => {
            if (document.visibilityState === 'visible') {
                await refreshAuth();
            }
        }, REFRESH_INTERVAL);

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [authLastRefresh, disableRefresh]);

    const contextValue = useMemo(() => ({
        auth,
        setAuth,
        authStatus,
        setAuthStatus,
        refreshAuth
    }), [authStatus, auth]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }

    return context;
}

export {AuthContext, AuthProvider, useAuth};