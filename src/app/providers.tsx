import React from 'react';
import {PrimeProvider} from '@/providers/prime.provider';
import {AuthProvider} from '@/providers/auth.provider';
import {ThemeProvider} from '@/providers/theme.provider';
import {headers} from 'next/headers';
import {AuthModel} from '@/lib/models/auth.model';
import {getAuth} from '@/actions/auth.actions';

export async function Providers({children}: { children: React.ReactNode }) {
    const headersList = await headers();
    const authHeader = headersList.get('x-auth-data');

    let initAuth: AuthModel = null;

    try {
        initAuth = authHeader ? JSON.parse(authHeader) : null;
    } catch (error: unknown) {
        console.error('Failed to parse auth header', error);
    }

    // Fallback if header is not present
    if (!initAuth) {
        const authResponse = await getAuth();

        initAuth = authResponse?.success && authResponse?.data ? authResponse?.data : null;
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