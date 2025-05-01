import React from 'react';
import {SideMenuProvider} from '@/app/dashboard/providers/side-menu.provider';

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <SideMenuProvider>
            {children}
        </SideMenuProvider>
    );
}