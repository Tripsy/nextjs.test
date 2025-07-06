'use client';

import React, {createContext, useState, ReactNode, useContext, useEffect, useMemo} from 'react';
import {AuthModel} from '@/lib/models/auth.model';
import {getAuth} from '@/lib/services/account.service';

type AuthContextType = {
    loading: boolean;
    auth: AuthModel | null;
    setAuth: (model: AuthModel | null) => void;
    refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

const AuthProvider = ({children, initAuth = null}: { children: ReactNode, initAuth?: AuthModel | null }) => {
    const [auth, setAuth] = useState<AuthModel | null>(initAuth);
    const [loading, setLoading] = useState(!initAuth);
    const [lastRefresh, setLastRefresh] = useState<number | null>(null);

    const refreshAuth = async () => {
        try {
            setLoading(true);

            const authData = await getAuth('same-site');

            setAuth(authData);
            setLastRefresh(Date.now());

            console.log('Auth refreshed', Date.now());
        } catch (error) {
            console.error('Auth refresh failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial fetch if no initAuth provided
        if (!initAuth) {
            refreshAuth().catch(error => {
                console.error('Failed to refresh auth:', error);
            });
        } else {
            setLastRefresh(Date.now());
        }
    }, [initAuth]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Refresh if it's been more than REFRESH_INTERVAL since last refresh
                if (lastRefresh && Date.now() - lastRefresh > REFRESH_INTERVAL) {
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
    }, [lastRefresh]);

    const contextValue = useMemo(() => ({
        loading,
        auth,
        setAuth,
        refreshAuth
    }), [loading, auth]);

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