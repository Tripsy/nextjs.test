'use client';

import React, {createContext, useState, ReactNode, useContext, useEffect} from 'react';
import {getResponseData, ResponseFetch} from '@/lib/api';
import {getAuth} from '@/lib/services/account.service';
import {normalizeUserData, UserModel} from '@/lib/user.model';

type AuthContextType = {
    loading: boolean;
    user: UserModel;
    setUser: (user: UserModel | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<UserModel>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuth = async () => {
            try {
                const fetchResponse: ResponseFetch<UserModel> | undefined = await getAuth();

                if (fetchResponse?.success) {
                    const userData = getResponseData(fetchResponse);

                    if (userData) {
                        return normalizeUserData(userData);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAuth()
            .then(res => setUser(res ?? null))
            .catch(error => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(error);
                }
            });
    }, []);

    return (
        <AuthContext.Provider value={{loading, user, setUser}}>
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
