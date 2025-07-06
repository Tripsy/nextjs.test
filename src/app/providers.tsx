import React from 'react';
import {PrimeProvider} from '@/providers/prime.provider';
import {AuthProvider} from '@/providers/auth.provider';
import {ThemeProvider} from '@/providers/theme.provider';
import {getAuth} from '@/lib/services/account.service';
import {getSessionToken} from '@/lib/utils/system';
import {headers} from 'next/headers';
import {AuthModel} from '@/lib/models/auth.model';

export async function Providers({children}: { children: React.ReactNode }) {
    const headersList = await headers();
    const authHeader = headersList.get('x-auth-data');

    let initAuth: AuthModel | null = null;

    try {
        initAuth = authHeader ? JSON.parse(authHeader) : null;
    } catch (error: unknown) {
        console.error('Failed to parse auth header', error);
    }

    // Fallback if header is not present
    if (!initAuth) {
        const sessionToken = await getSessionToken();

        initAuth = sessionToken ? await getAuth('remote-api', sessionToken) : null;
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