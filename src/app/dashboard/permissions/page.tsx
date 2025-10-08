import React from 'react';
import NavBreadcrumbSetter from '@/app/dashboard/_components/nav-breadcrumb.setter';
import {BreadcrumbType} from '@/providers/dashboard/breadcrumb.provider';
import type {Metadata} from 'next';
import {lang} from '@/config/lang';

export const metadata: Metadata = {
    title: `Permissions - Dashboard | ${lang('app.name')}`,
};

export default function Page() {
    const items: BreadcrumbType[] = [
        {label: 'Dashboard', href: '_components'},
        {label: 'Permissions'},
    ];

    return (
        <>
            <NavBreadcrumbSetter items={items}/>
            Permissions
        </>
    );
}