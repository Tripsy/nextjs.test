'use client';

import {PrimeReactProvider} from 'primereact/api';
import {useTheme} from '@/providers/theme.provider';
import {ReactNode, useEffect} from 'react';

export const PrimeProvider = ({children}: { children: ReactNode }) => {
    const {theme} = useTheme();

    useEffect(() => {
        // Load or update theme CSS dynamically
        const themeLink = document.getElementById('prime-theme') as HTMLLinkElement | null;
        const coreLink = document.getElementById('prime-core') as HTMLLinkElement | null;

        if (!themeLink) {
            const link = document.createElement('link');
            link.id = 'prime-theme';
            link.rel = 'stylesheet';
            link.href = `https://unpkg.com/primereact/resources/themes/lara-${theme}-blue/theme.css`;
            document.head.appendChild(link);
        } else {
            themeLink.href = `https://unpkg.com/primereact/resources/themes/lara-${theme}-blue/theme.css`;
        }

        if (!coreLink) {
            const link = document.createElement('link');
            link.id = 'prime-core';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/primereact/resources/primereact.min.css';
            document.head.appendChild(link);
        }

        return () => {
            themeLink?.remove();
            coreLink?.remove();
        };
    }, [theme]);

    return (
        <PrimeReactProvider>
            {children}
        </PrimeReactProvider>
    );
};