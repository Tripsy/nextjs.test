import React from 'react';
import BreadcrumbSetter from '@/app/dashboard/components/breadcrumb.setter';
import {BreadcrumbType} from '@/app/dashboard/providers/breadcrumb.provider';
import DataTableList, {
    DateBodyTemplate,
    StatusBodyTemplate,
    TableColumnsType
} from '@/app/dashboard/components/table-list.component';
import {RoleBodyTemplate} from '@/app/dashboard/components/users/table-list.component';

export default function Page() {
    const items: BreadcrumbType[] = [
        {label: 'Dashboard', href: 'dashboard'},
        {label: 'Projects'},
    ];

    const columns: TableColumnsType = [
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
            <DataTableList dataSource="users" columns={columns}/>
        </>
    );
}