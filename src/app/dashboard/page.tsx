import type {Metadata} from 'next';
import {BreadcrumbType} from '@/app/dashboard/providers/breadcrumb.provider';
import BreadcrumbSetter from '@/app/dashboard/components/breadcrumb.setter';
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
            <BreadcrumbSetter items={items}/>
            Dashboard
        </>
    );
}