import type {Metadata} from 'next';
import {BreadcrumbType} from '@/providers/dashboard/breadcrumb.provider';
import NavBreadcrumbSetter from '@/components/dashboard/nav-breadcrumb.setter';
import React from 'react';
import {lang} from '@/config/lang';

export const metadata: Metadata = {
    title: `Dashboard | ${lang('app.name')}`,
};

export default function Page() {
    const items: BreadcrumbType[] = [
        {label: 'Dashboard'}
    ];

    return (
        <>
            <NavBreadcrumbSetter items={items}/>
            Dashboard
        </>
    );
}