import React from 'react';
import BreadcrumbSetter from '@/app/dashboard/components/breadcrumb.setter';
import {BreadcrumbType} from '@/app/dashboard/providers/breadcrumb.provider';
import DataTableList, {
    DateBodyTemplate,
    StatusBodyTemplate
} from '@/app/dashboard/components/table-list.component';
import {
    FilterBodyTemplate,
    onRowSelect,
    onRowUnselect,
    RoleBodyTemplate
} from '@/app/dashboard/components/users/table-list.component';
import type {Metadata} from 'next';
import {lang} from '@/config/lang';
import {TableColumnsType} from '@/app/dashboard/types/table-list.type';

export const metadata: Metadata = {
    title: `Users - Dashboard | ${lang.app.name}`,
};

export default function Page() {
    const items: BreadcrumbType[] = [
        {label: 'Dashboard', href: 'dashboard'},
        {label: 'Users'},
    ];

    const UserTableColumns: TableColumnsType = [
        {field: 'id', header: 'ID', sortable: true},
        {field: 'name', header: 'Name', sortable: true},
        {field: 'email', header: 'Email'},
        {field: 'role', header: 'Role', body: RoleBodyTemplate},
        {field: 'status', header: 'Status', body: StatusBodyTemplate, style: {maxWidth: '6rem'}},
        {field: 'created_at', header: 'Created At', sortable: true, body: DateBodyTemplate},
    ];

    return (
        <>
            <BreadcrumbSetter items={items}/>
            <DataTableList
                dataSource="users" columns={UserTableColumns}
                filterBody={FilterBodyTemplate}
                selectionMode="multiple" onRowSelect={onRowSelect} onRowUnselect={onRowUnselect}
            />
        </>
    );
}