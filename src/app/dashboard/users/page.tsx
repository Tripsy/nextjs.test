import React from 'react';
import NavBreadcrumbSetter from '@/app/dashboard/components/nav-breadcrumb.setter';
import {BreadcrumbType} from '@/app/dashboard/providers/breadcrumb.provider';
import type {Metadata} from 'next';
import {DataTableUsers} from '@/app/dashboard/users/data-table-users.component';
import {lang} from '@/config/lang';

export const metadata: Metadata = {
    title: `Users - Dashboard | ${lang('app.name')}`,
};

export default function Page() {
    const items: BreadcrumbType[] = [
        {label: 'Dashboard', href: 'dashboard'},
        {label: 'Users'},
    ];

    return (
        <>
            <NavBreadcrumbSetter items={items}/>
            <DataTableUsers/>
        </>
    );
}