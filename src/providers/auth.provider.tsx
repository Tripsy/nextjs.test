'use client'

import React, {createContext, useState, ReactNode, useContext, useEffect} from 'react';

type Auth = 'light' | 'dark';

const AuthContext = createContext<{
    theme: Auth;
    toggleAuth: (theme: Auth) => void;
} | undefined>(undefined);

const AuthProvider = ({children}: { children: ReactNode }) => {
    const [theme, setAuth] = useState<Auth>('light');

    useEffect(() => {
        const saved = localStorage.getItem('theme') as Auth;
        const initial = saved || 'light';

        setAuth(initial);

        document.documentElement.setAttribute('data-theme', initial);
    }, [theme]);

    const toggleAuth = (value: Auth) => {
        setAuth(value);

        document.documentElement.setAttribute('data-theme', value);

        localStorage.setItem('theme', value);
    };

    return (
        <AuthContext.Provider value={{theme, toggleAuth}}>
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
