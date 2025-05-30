'use client'

import React, {createContext, useState, ReactNode, useContext, useEffect} from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
    theme: Theme;
    toggleTheme: (theme: Theme) => void;
} | undefined>(undefined);

const ThemeProvider = ({children}: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const saved = localStorage.getItem('theme') as Theme;
        const initial = saved || 'light';

        setTheme(initial);

        document.documentElement.setAttribute('data-theme', initial);
    }, [theme]);

    const toggleTheme = (value: Theme) => {
        setTheme(value);

        document.documentElement.setAttribute('data-theme', value);

        localStorage.setItem('theme', value);
    };

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

function useTheme() {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}

export {ThemeContext, ThemeProvider, useTheme};
