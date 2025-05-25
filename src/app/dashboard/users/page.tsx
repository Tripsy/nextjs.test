import React from 'react';
import BreadcrumbSetter from '@/app/dashboard/components/breadcrumb.setter';
import {BreadcrumbType} from '@/app/dashboard/providers/breadcrumb.provider';
import DataTableList, {
    DateBodyTemplate,
    StatusBodyTemplate,
    TableColumnsType
} from '@/app/dashboard/components/table-list.component';
import {onRowSelect, onRowUnselect, RoleBodyTemplate} from '@/app/dashboard/components/users/table-list.component';
import type {Metadata} from 'next';
import {lang} from '@/config/lang';
import {DataTableFilterMeta} from 'primereact/datatable';

export const metadata: Metadata = {
    title: `Users - Dashboard | ${lang.app.name}`,
};

export default function Page() {
    const items: BreadcrumbType[] = [
        {label: 'Dashboard', href: 'dashboard'},
        {label: 'Users'},
    ];

    const columns: TableColumnsType = [
        {field: 'id', header: 'ID', sortable: true},
        {field: 'name', header: 'Name', sortable: true},
        {field: 'email', header: 'Email'},
        {field: 'role', header: 'Role', body: RoleBodyTemplate},
        {field: 'status', header: 'Status', body: StatusBodyTemplate, style: {maxWidth: '6rem'}},
        {field: 'created_at', header: 'Created At', sortable: true, body: DateBodyTemplate},
    ];

    const filters: DataTableFilterMeta = {
        id: {value: null, matchMode: 'equals'},
        term: {value: null, matchMode: 'contains'},
        role: {value: null, matchMode: 'equals'},
        status: {value: null, matchMode: 'equals'},
        create_date_start: {value: null, matchMode: 'equals'},
        create_date_end: {value: null, matchMode: 'equals'},
        is_deleted: {value: null, matchMode: 'equals'},
    };

    return (
        <>
            <BreadcrumbSetter items={items}/>
            <DataTableList
                dataSource="users" columns={columns} filters={filters}
                selectionMode="multiple" onRowSelect={onRowSelect} onRowUnselect={onRowUnselect}
            />
        </>
    );
}