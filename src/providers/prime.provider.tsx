'use client';

import {PrimeReactProvider} from 'primereact/api';
import {useTheme} from '@/providers/theme.provider';
import React from 'react';

export const PrimeProvider = ({children}: { children: React.ReactNode }) => {
    const {theme} = useTheme();

    return (
        <PrimeReactProvider>
            <link
                id="prime-theme"
                rel="stylesheet"
                href={`https://unpkg.com/primereact/resources/themes/lara-${theme}-blue/theme.css`}
            />
            <link
                rel="stylesheet"
                href="https://unpkg.com/primereact/resources/primereact.min.css"
            />
            {children}
        </PrimeReactProvider>
    );
};