import React from 'react';
import {SideMenuProvider} from '@/app/dashboard/_providers/side-menu.provider';
import {BreadcrumbProvider} from '@/app/dashboard/_providers/breadcrumb.provider';

export function DashboardProvider({children}: { children: React.ReactNode }) {
    return (
        <BreadcrumbProvider>
            <SideMenuProvider>
                {children}
            </SideMenuProvider>
        </BreadcrumbProvider>
    );
}