import React from 'react';
import {PrimeProvider} from '@/providers/prime.provider';

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <PrimeProvider>
            {children}
        </PrimeProvider>
    );
}