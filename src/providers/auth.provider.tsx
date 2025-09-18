'use client';

import React, {createContext, useState, ReactNode, useContext, useEffect, useMemo, useCallback} from 'react';
import {AuthModel} from '@/lib/models/auth.model';
import {useSearchParams} from 'next/navigation';
import {ApiError} from '@/lib/exceptions/api.error';
import {getAuth} from '@/actions/auth.actions';

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
    const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');

    const searchParams = useSearchParams();

    const fromLogin = useMemo(
        () => searchParams.get('from') === 'login',
        [searchParams]
    );

    const refreshAuth = useCallback(async () => {
        try {
            console.log('refreshAuth');
            setAuthStatus('loading');

            const authResponse = await getAuth();

            const authData = authResponse?.success && authResponse?.data ? authResponse?.data : null;

            setAuth(authData);

            if (authData) {
                setAuthStatus('authenticated');
            } else {
                setAuthStatus('unauthenticated');
            }
        } catch (error: unknown) {
            if (error instanceof ApiError && error.status === 401) {
                setAuthStatus('unauthenticated');
            } else {
                setAuthStatus('error');
            }
        }
    }, [setAuth, setAuthStatus]);

    // Initial auth setup
    useEffect(() => {
        if (initAuth) {
            setAuth(initAuth);
            setAuthStatus('authenticated');
        } else {
            (async () => {
                await refreshAuth();
            })();
        }
    }, [initAuth, refreshAuth]);

    // Check if coming from login and refresh auth
    useEffect(() => {
        if (fromLogin && authStatus === 'unauthenticated') {
            // Clean up the URL
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('from');
            window.history.replaceState({}, '', newUrl.toString());

            (async () => {
                await refreshAuth();
            })();
        }
    }, [authStatus, fromLogin, refreshAuth]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (document.visibilityState === 'visible') {
                (async () => {
                    await refreshAuth();
                })();
            }
        }, REFRESH_INTERVAL);

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                (async () => {
                    await refreshAuth();
                })();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [refreshAuth]);

    const contextValue = useMemo(() => ({
        auth,
        setAuth,
        authStatus,
        setAuthStatus,
        refreshAuth
    }), [auth, authStatus, refreshAuth]);

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