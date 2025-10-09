'use client'

import React, {createContext, useState, ReactNode, useContext, useLayoutEffect} from 'react';
import {usePathname} from 'next/navigation';
import {isLargeScreen} from '@/lib/utils/window';

type Status = 'open' | 'closed';

const SideMenuContext = createContext<{
    status: Status;
    toggleStatus: (status: Status) => void;
} | undefined>(undefined);

const SideMenuProvider = ({children}: { children: ReactNode }) => {
    const [status, setStatus] = useState<Status>('open');
    const pathname = usePathname();

    useLayoutEffect(() => {
        let status: Status;

        if (isLargeScreen()) {
            const saved = localStorage.getItem('_providers-side-menu') as Status;

            status = saved || 'open';
        } else {
            status = 'closed';
        }

        setStatus(status);
    }, []);

    // On route change, close menu on small screens
    useLayoutEffect(() => {
        if (!isLargeScreen()) {
            setStatus('closed');
        }
    }, [pathname]);

    const toggleStatus = (status: Status): void => {
        setStatus(status);

        localStorage.setItem('_providers-side-menu', status);
    };

    return (
        <SideMenuContext.Provider value={{status, toggleStatus}}>
            {children}
        </SideMenuContext.Provider>
    );
};

function useSideMenu() {
    const context = useContext(SideMenuContext);

    if (context === undefined) {
        throw new Error('useSideMenu must be used within a SideMenuProvider');
    }

    return context;
}


export {SideMenuContext, SideMenuProvider, useSideMenu};
