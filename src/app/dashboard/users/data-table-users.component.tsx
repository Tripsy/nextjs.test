'use client';

import React, {JSX} from 'react';
import {DataTableColumnsType} from '@/types/data-table.type';
import DataTableList from '@/components/dashboard/data-table-list.component';
import {DataTableFiltersUsers} from '@/app/dashboard/users/data-table-filters-users.component';
import {UserModel} from '@/lib/models/user.model';
import {
    CapitalizeBodyTemplate,
    DateBodyTemplate,
    StatusBodyTemplate
} from '@/components/dashboard/data-table-row.component';
import {DataTableActions} from '@/components/dashboard/data-table-actions.component';
import {UserTableParams} from '@/lib/services/user.service';
import {DataTableProvider} from '@/providers/dashboard/data-table-provider';
import {Loading} from '@/components/loading.component';
import {useMounted} from '@/hooks';

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
        <DataTableProvider dataSource="users" selectionMode="checkbox" defaultFilters={UserTableParams.filters}>
            <div className="standard-box p-4 shadow-md">
                <DataTableFiltersUsers/>
                <DataTableActions/>
                <DataTableList
                    dataKey="id"
                    columns={TableColumns}
                    scrollHeight="400px"
                />
            </div>
        </DataTableProvider>
    );
}