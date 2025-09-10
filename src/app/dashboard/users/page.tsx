import React from 'react';
import NavBreadcrumbSetter from '@/components/dashboard/nav-breadcrumb.setter';
import {BreadcrumbType} from '@/providers/dashboard/breadcrumb.provider';
import type {Metadata} from 'next';
import {lang} from '@/config/lang';
import {DataTableUsers} from '@/app/dashboard/users/data-table-users.component';

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
