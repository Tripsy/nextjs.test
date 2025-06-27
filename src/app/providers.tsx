import React from 'react';
import {PrimeProvider} from '@/providers/prime.provider';
import {AuthProvider} from '@/providers/auth.provider';
import {ThemeProvider} from '@/providers/theme.provider';

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <PrimeProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </PrimeProvider>
        </ThemeProvider>
    );
}