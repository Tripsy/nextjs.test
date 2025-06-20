import React from 'react';
import BreadcrumbSetter from '@/app/dashboard/components/breadcrumb.setter';
import {BreadcrumbType} from '@/app/dashboard/providers/breadcrumb.provider';
import type {Metadata} from 'next';
import {generics} from '@/config/lang';
import {DataTableUsers} from '@/app/dashboard/users/data-table-users.component';

export const metadata: Metadata = {
    title: `Users - Dashboard | ${generics.appName}`,
};

export default function Page() {
    const items: BreadcrumbType[] = [
        {label: 'Dashboard', href: 'dashboard'},
        {label: 'Users'},
    ];

    return (
        <>
            <BreadcrumbSetter items={items}/>
            <DataTableUsers/>
        </>
    );
}