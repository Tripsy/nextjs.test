import React from 'react';
import {SideMenuProvider} from '@/app/dashboard/providers/side-menu.provider';
import {BreadcrumbProvider} from '@/app/dashboard/providers/breadcrumb.provider';
import {PrimeProvider} from '@/providers/prime.provider';

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <PrimeProvider>
            <BreadcrumbProvider>
                <SideMenuProvider>
                    {children}
                </SideMenuProvider>
            </BreadcrumbProvider>
        </PrimeProvider>
    );
}