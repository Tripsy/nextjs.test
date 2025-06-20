import type {Metadata} from 'next';
import {settings} from '@/config/settings';
import {BreadcrumbType} from '@/app/dashboard/providers/breadcrumb.provider';
import BreadcrumbSetter from '@/app/dashboard/components/breadcrumb.setter';
import React from 'react';

export const metadata: Metadata = {
    title: `Dashboard | ${settings.appName}`,
};

export default function Page() {
    const items: BreadcrumbType[] = [
        {label: 'Dashboard'}
    ];

    return (
        <>
            <BreadcrumbSetter items={items}/>
            <div>
                Dashboard
            </div>
        </>
    );
}