import React from 'react';
import {PrimeProvider} from '@/providers/prime.provider';
import {AuthProvider} from '@/providers/auth.provider';
import {ThemeProvider} from '@/providers/theme.provider';
import {headers} from 'next/headers';
import {AuthModel} from '@/lib/models/auth.model';

export async function Providers({children}: { children: React.ReactNode }) {
    const headersList = await headers();
    const authHeader = headersList.get('x-auth-data');

    let initAuth: AuthModel = null;

    try {
        initAuth = authHeader ? JSON.parse(authHeader) : null;
    } catch (error: unknown) {
        console.error('Failed to parse auth header', error);
    }

    return (
        <ThemeProvider>
            <PrimeProvider>
                <AuthProvider initAuth={initAuth}>
                    {children}
                </AuthProvider>
            </PrimeProvider>
        </ThemeProvider>
    );
}