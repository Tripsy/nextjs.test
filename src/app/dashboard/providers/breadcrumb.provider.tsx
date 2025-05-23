'use client'

import React, {createContext, useState, ReactNode, useContext} from 'react';

export type BreadcrumbType = { label: string; href?: string };

const BreadcrumbContext = createContext<{
    items: BreadcrumbType[];
    setItems: (items: BreadcrumbType[]) => void;
} | undefined>(undefined);

const BreadcrumbProvider = ({children}: { children: ReactNode }) => {
    const [items, setItems] = useState<BreadcrumbType[]>([]);

    return (
        <BreadcrumbContext.Provider value={{ items, setItems }}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

function useBreadcrumb() {
    const context = useContext(BreadcrumbContext);

    if (context === undefined) {
        throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
    }

    return context;
}


export {BreadcrumbContext, BreadcrumbProvider, useBreadcrumb};

