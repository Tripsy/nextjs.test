'use client';

import {UserEntryType, UserTableFilters, UserTableFiltersType} from '@/lib/services/user.service';
import React, {JSX, useCallback, useEffect, useState} from 'react';
import {Icons} from '@/components/icon.component';
import {LazyStateType, DataTableColumnsType, DataTablePropsType} from '@/app/dashboard/types/data-table.type';
import DataTableList, {
    CapitalizeBodyTemplate,
    DateBodyTemplate,
    StatusBodyTemplate
} from '@/app/dashboard/components/data-table-list.component';
import {readFromLocalStorage} from '@/lib/utils/storage';
import {Loading} from '@/components/loading.component';
import {DataTableFiltersUsers} from '@/app/dashboard/users/data-table-filters-users.component';

export const onRowSelect = (entry: UserEntryType) => {
    console.log('show')
    console.log(entry)
    // toast.current?.show({ severity: 'info', summary: 'Product Selected', detail: `Name: ${event.data.name}`, life: 3000 });
};

export const onRowUnselect = (entry: UserEntryType) => {
    console.log('hide')
    console.log(entry)
    // toast.current?.show({ severity: 'warn', summary: 'Product Unselected', detail: `Name: ${event.data.name}`, life: 3000 });
};

export const DataTableUsers = (): JSX.Element => {
    const TableColumns: DataTableColumnsType = [
        {field: 'id', header: 'ID', sortable: true},
        {field: 'name', header: 'Name', sortable: true},
        {field: 'email', header: 'Email'},
        {field: 'role', header: 'Role', body: CapitalizeBodyTemplate},
        {field: 'status', header: 'Status', body: StatusBodyTemplate, style: {maxWidth: '6rem'}},
        {field: 'created_at', header: 'Created At', sortable: true, body: DateBodyTemplate},
    ];

    const [selectedEntries, setSelectedEntries] = useState<UserEntryType[]>([]);

    const handleSelectionChange = useCallback((selectedEntries: UserEntryType[]) => {
        setSelectedEntries(selectedEntries);
    }, []);

    const [filters, setFilters] = useState<UserTableFiltersType>(UserTableFilters);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        // This effect only runs on client-side after mount
        const savedState = readFromLocalStorage<LazyStateType<UserTableFiltersType>>('data-table-state-users');

        if (savedState?.filters) {
            setFilters(savedState.filters);
        }

        setHydrated(true);
    }, []);

    // Show loading state while hydrating
    if (!hydrated) {
        return (
            <div className="flex justify-center items-center h-32 text-xl">
                <Loading text="Please wait..." />
            </div>
        );
    }


    //TODO
    // const handleDeleteSelected = () => {
    //     // Your delete logic here
    //     console.log('Deleting selected users:', selectedEntries);
    //     setSelectedEntries([]); // Clear selection after delete
    // };

    const selectionMode: DataTablePropsType<'users'>['selectionMode'] = 'checkbox';

    const isMultipleSelectionMode = (selectionMode: DataTablePropsType<'users'>['selectionMode']) => {
        return selectionMode === 'multiple';
    };

    return (
        <div className="standard-box p-4 shadow-md">
            <DataTableFiltersUsers filters={filters} setFilterAction={setFilters} />

            // TODO
            // make this a separate component  DataTableActions
            // when single entry is selected show edit / activate / deactivate & restore
            <div className="my-6 pt-4 border-t border-line flex justify-between">
                <div className="flex items-center gap-2">
                    {isMultipleSelectionMode(selectionMode) && (
                        <div>
                            {selectedEntries.length} selected
                        </div>
                    )}

                    {selectedEntries.length > 0 && (
                        <button className="btn btn-md btn-delete">
                            <Icons.Action.Delete className="w-4 h-4" />
                            Delete
                        </button>
                    )}
                </div>
                <div>
                    <button className="btn btn-info">
                        <Icons.Action.Add className="w-4 h-4" />
                        Create user
                    </button>
                </div>
            </div>
            <DataTableList
                dataSource="users" dataKey="id" columns={TableColumns}
                filters={filters}
                selectionMode="checkbox" onSelectionChange={handleSelectionChange} onRowSelect={onRowSelect} onRowUnselect={onRowUnselect}
                scrollHeight="400px"
            />
        </div>
    );
}