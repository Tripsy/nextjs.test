'use client'

import React, {createContext, useState, ReactNode, useContext, useEffect} from 'react';

type Status = 'open' | 'closed';

const SideMenuContext = createContext<{
    status: Status;
    toggleStatus: (status: Status) => void;
} | undefined>(undefined);

const SideMenuProvider = ({children}: { children: ReactNode }) => {
    const [status, setStatus] = useState<Status>('open');

    useEffect(() => {
        const saved = localStorage.getItem('dashboard-side-menu') as Status;
        const status: Status = saved || 'open';

        setStatus(status);
    }, [status]);

    const toggleStatus = (status: Status): void => {

        console.log(status)
        setStatus(status);

        localStorage.setItem('dashboard-side-menu', status);
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
