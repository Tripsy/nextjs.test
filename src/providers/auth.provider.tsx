'use client';

import React, {createContext, useState, ReactNode, useContext, useEffect, useMemo} from 'react';
import {AuthModel} from '@/lib/models/auth.model';
import {getAuth} from '@/lib/services/account.service';
import {isExcludedRoute} from '@/config/routes';
import {usePathname} from 'next/navigation';

type AuthContextType = {
    loadingAuth: boolean;
    auth: AuthModel | null;
    setAuth: (model: AuthModel | null) => void;
    refreshAuth: () => Promise<void>;
    setLastRefreshAuth: (timestamp: number | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

const AuthProvider = ({children, initAuth = null}: { children: ReactNode, initAuth?: AuthModel | null }) => {
    const [auth, setAuth] = useState<AuthModel | null>(initAuth);
    const [loadingAuth, setLoadingAuth] = useState(!initAuth);
    const [lastRefreshAuth, setLastRefreshAuth] = useState<number | null>(null);

    const pathname = usePathname();

    const disableRefresh = useMemo(() => {
        return isExcludedRoute(pathname);
    }, [pathname]);

    const refreshAuth = async () => {
        try {
            setLoadingAuth(true);

            const authData = await getAuth('same-site');

            setAuth(authData);
            setLastRefreshAuth(Date.now());
        } catch (error) {
            console.error('Auth refresh failed:', error);
        } finally {
            setLoadingAuth(false);
        }
    };

    useEffect(() => {
        // Initial fetch if no initAuth provided
        if (!initAuth) {
            refreshAuth().catch(error => {
                console.error('Failed to refresh auth:', error);
            });
        } else {
            setLastRefreshAuth(Date.now());
        }
    }, [initAuth]);

    useEffect(() => {
        // Don't refresh if disabled - based on excluded auth routes
        if (disableRefresh) {
            return;
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Refresh if it's been more than REFRESH_INTERVAL since last refresh
                if (lastRefreshAuth && Date.now() - lastRefreshAuth > REFRESH_INTERVAL) {
                    refreshAuth().catch(error => {
                        console.error('Failed to refresh auth:', error);
                    });
                }
            }
        };

        const intervalId = setInterval(() => {
            if (document.visibilityState === 'visible') {
                refreshAuth().catch(error => {
                    console.error('Failed to refresh auth:', error);
                });
            }
        }, REFRESH_INTERVAL);

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [lastRefreshAuth, disableRefresh]);

    const contextValue = useMemo(() => ({
        loadingAuth,
        auth,
        setAuth,
        refreshAuth,
        setLastRefreshAuth
    }), [loadingAuth, auth]);

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