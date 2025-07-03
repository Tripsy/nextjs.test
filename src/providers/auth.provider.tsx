'use client';

import React, {createContext, useState, ReactNode, useContext, useEffect} from 'react';
import {AuthModel} from '@/lib/models/auth.model';
import {getAuth} from '@/lib/services/account.service';
import {app} from '@/config/settings';

type AuthContextType = {
    loading: boolean;
    auth: AuthModel;
    setAuth: (model: AuthModel) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({children}: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthModel>(null);
    const [loading, setLoading] = useState(true);

    // TODO: add check based on role -> see routes settings
    useEffect(() => {
        const fetchAuth = async () => {
            try {
                return getAuth();
            } finally {
                setLoading(false);
            }
        };

        fetchAuth()
            .then(res => setAuth(res ?? null))
            .catch(error => {
                if (app('environment') === 'development') {
                    console.log(error);
                }
            });
    }, []);

    return (
        <AuthContext.Provider value={{loading, auth, setAuth}}>
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
