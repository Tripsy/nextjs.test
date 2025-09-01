import React from 'react';
import {SideMenuProvider} from '@/providers/dashboard/side-menu.provider';
import {BreadcrumbProvider} from '@/providers/dashboard/breadcrumb.provider';

export function DashboardProvider({children}: { children: React.ReactNode }) {
    return (
        <BreadcrumbProvider>
            <SideMenuProvider>
                {children}
            </SideMenuProvider>
        </BreadcrumbProvider>
    );
}