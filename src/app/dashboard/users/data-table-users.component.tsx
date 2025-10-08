'use client';

import React, {JSX} from 'react';
import {DataTableColumnsType} from '@/types/data-table.type';
import DataTableList from '@/app/dashboard/_components/data-table-list.component';
import {DataTableFiltersUsers} from '@/app/dashboard/users/data-table-filters-users.component';
import {UserModel} from '@/lib/models/user.model';
import {
    CapitalizeBodyTemplate,
    DateBodyTemplate,
    StatusBodyTemplate
} from '@/app/dashboard/_components/data-table-row.component';
import {DataTableActions} from '@/app/dashboard/_components/data-table-actions.component';
import {DataTableProvider} from '@/providers/dashboard/data-table-provider';
import {Loading} from '@/components/loading.component';
import {useMounted} from '@/hooks';
import {FormManageUsers} from '@/app/dashboard/users/form-manage-users.component';
import {UsersTableState} from '@/app/dashboard/users/users.definition';

const TableColumns: DataTableColumnsType<UserModel> = [
    {field: 'id', header: 'ID', sortable: true},
    {field: 'name', header: 'Name', sortable: true},
    {field: 'email', header: 'Email'},
    {field: 'role', header: 'Role', body: CapitalizeBodyTemplate},
    {field: 'status', header: 'Status', body: StatusBodyTemplate, style: {maxWidth: '6rem'}},
    {field: 'created_at', header: 'Created At', sortable: true, body: DateBodyTemplate},
];

//TODO
// const handleDeleteSelected = () => {
//     // Your delete logic here
//     console.log('Deleting selected users:', selectedEntries);
//     setSelectedEntries([]); // Clear selection after delete
// };

export const DataTableUsers = (): JSX.Element => {
    const isMounted = useMounted();

    if (!isMounted) {
        return <Loading/>;
    }

    return (
        <DataTableProvider dataSource="users" selectionMode="checkbox" defaultState={UsersTableState}>
            <div className="standard-box p-4 shadow-md">
                <DataTableFiltersUsers/>
                <DataTableActions/>
                <DataTableList
                    dataKey="id"
                    columns={TableColumns}
                    scrollHeight="400px"
                />
            </div>
            <FormManageUsers/>
        </DataTableProvider>
    );
}