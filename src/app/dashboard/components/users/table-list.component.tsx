'use client';

import {capitalizeFirstLetter} from '@/lib/utils/string';
import {UserEntryType, UserTableFilters, UserTableFiltersType} from '@/lib/services/user.service';
import {IconField} from 'primereact/iconfield';
import {InputIcon} from 'primereact/inputicon';
import {InputText} from 'primereact/inputtext';
import React, {JSX, useEffect, useState} from 'react';
import {Dropdown, DropdownChangeEvent} from 'primereact/dropdown';
import {UserRoleEnum, UserStatusEnum} from '@/lib/enums';
import {Icons} from '@/components/icon.component';
import {TableColumnsType, TableFiltersType} from '@/app/dashboard/types/table-list.type';
import {useDebouncedEffect} from '@/app/hooks';
import DataTableList, {
    DateBodyTemplate,
    LazyStateType,
    StatusBodyTemplate
} from '@/app/dashboard/components/table-list.component';
import {readFromLocalStorage} from '@/lib/utils/storage';

const statuses = Object.values(UserStatusEnum).map((status) => ({
    label: capitalizeFirstLetter(status),
    value: status,
}));

const roles = Object.values(UserRoleEnum).map((role) => ({
    label: capitalizeFirstLetter(role),
    value: role,
}));

export const Filters= ({
   filters,
   setFilterAction,
}: TableFiltersType<UserTableFiltersType>): React.JSX.Element => {
    const [tempFilters, setTempFilters] = useState(filters);

    useEffect(() => {
        setTempFilters(filters); // sync on external changes (like localStorage restore)
    }, [filters]);

    useDebouncedEffect(() => {
        setFilterAction(tempFilters);
    }, [tempFilters], 1000);

    const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempFilters({
            ...tempFilters,
            global: {value: e.target.value, matchMode: 'contains'},
        });
    };

    const handleStatusChange = (e: DropdownChangeEvent) => {
        setTempFilters({
            ...tempFilters,
            status: {value: e.value, matchMode: 'equals'},
        });
    };

    const handleRoleChange = (e: DropdownChangeEvent) => {
        setTempFilters({
            ...tempFilters,
            role: {value: e.value, matchMode: 'equals'},
        });
    };

    return (
        <div className="flex gap-x-4 mb-4">
            <IconField iconPosition="left">
                <InputIcon>
                    <div className="flex items-center">
                        <Icons.Search className="w-4 h-4"/>
                    </div>
                </InputIcon>
                <InputText
                    placeholder="Search"
                    value={filters.global.value ?? ''}
                    onChange={handleTermChange}
                />
            </IconField>

            <Dropdown
                value={filters.status.value}
                options={statuses}
                onChange={handleStatusChange}
                placeholder="Status"
                showClear
            />

            <Dropdown
                value={filters.role.value}
                options={roles}
                onChange={handleRoleChange}
                placeholder="Role"
                showClear
            />
        </div>
    );
};

export const RoleBodyTemplate = (entry: { role: string; }) => {
    return capitalizeFirstLetter(entry.role);
};

export const onRowSelect = (data: UserEntryType) => {
    console.log('show')
    console.log(data)
    // toast.current?.show({ severity: 'info', summary: 'Product Selected', detail: `Name: ${event.data.name}`, life: 3000 });
};

export const onRowUnselect = (data: UserEntryType) => {
    console.log('hide')
    console.log(data)
    // toast.current?.show({ severity: 'warn', summary: 'Product Unselected', detail: `Name: ${event.data.name}`, life: 3000 });
};

export const DataTableListUsers = (): JSX.Element => {
    const TableColumns: TableColumnsType = [
        {field: 'id', header: 'ID', sortable: true},
        {field: 'name', header: 'Name', sortable: true},
        {field: 'email', header: 'Email'},
        {field: 'role', header: 'Role', body: RoleBodyTemplate},
        {field: 'status', header: 'Status', body: StatusBodyTemplate, style: {maxWidth: '6rem'}},
        {field: 'created_at', header: 'Created At', sortable: true, body: DateBodyTemplate},
    ];

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

    // Optional: Show loading state while hydrating
    if (!hydrated) {
        return <div className="flex justify-center items-center h-64">
            Loading
        </div>;
    }

    return (
        <div className="rounded-2xl p-4 bg-base-100">
            <Filters filters={filters} setFilterAction={setFilters} />
            <DataTableList
                dataSource="users" columns={TableColumns}
                filters={filters}
                selectionMode="multiple" onRowSelect={onRowSelect} onRowUnselect={onRowUnselect}
            />
        </div>
    );
}