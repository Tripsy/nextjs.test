import React from 'react';
import {SideMenuProvider} from '@/app/dashboard/providers/side-menu.provider';
import {BreadcrumbProvider} from '@/app/dashboard/providers/breadcrumb.provider';
import {Providers} from '@/app/providers';

export function DashboardProvider({children}: { children: React.ReactNode }) {
    return (
        <Providers>
            <BreadcrumbProvider>
                <SideMenuProvider>
                    {children}
                </SideMenuProvider>
            </BreadcrumbProvider>
        </Providers>
    );
}