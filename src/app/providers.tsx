import React from 'react';
import {PrimeProvider} from '@/providers/prime.provider';
import {AuthProvider} from '@/providers/auth.provider';
import {ThemeProvider} from '@/providers/theme.provider';
import {headers} from 'next/headers';
import {AuthModel} from '@/lib/models/auth.model';
import {ToastProvider} from '@/providers/toast.provider';

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
                <ToastProvider>
                    <AuthProvider initAuth={initAuth}>
                        {children}
                    </AuthProvider>
                </ToastProvider>
            </PrimeProvider>
        </ThemeProvider>
    );
}