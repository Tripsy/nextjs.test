import React from 'react';
import {SideMenuProvider} from '@/app/dashboard/providers/side-menu.provider';
import {BreadcrumbProvider} from '@/app/dashboard/providers/breadcrumb.provider';

export function DashboardProvider({children}: { children: React.ReactNode }) {
    return (
        <BreadcrumbProvider>
            <SideMenuProvider>
                {children}
            </SideMenuProvider>
        </BreadcrumbProvider>
    );
}