'use client';

import {capitalizeFirstLetter, formatDateFromFilter, getValidDate, parseDate} from '@/lib/utils/string';
import {UserEntryType, UserTableFilters, UserTableFiltersType} from '@/lib/services/user.service';
import {IconField} from 'primereact/iconfield';
import {InputIcon} from 'primereact/inputicon';
import {InputText} from 'primereact/inputtext';
import React, {JSX, useCallback, useEffect, useState} from 'react';
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
import {Loading} from '@/components/loading.component';
import {Button} from 'primereact/button';
import {Checkbox, CheckboxChangeEvent} from 'primereact/checkbox';
import {Calendar} from 'primereact/calendar';
import {Nullable} from 'primereact/ts-helpers';

const statuses = Object.values(UserStatusEnum).map((status) => ({
    label: capitalizeFirstLetter(status),
    value: status,
}));

const roles = Object.values(UserRoleEnum).map((role) => ({
    label: capitalizeFirstLetter(role),
    value: role,
}));

export const Filters = ({
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

    const handleIsDeletedChange = (e: CheckboxChangeEvent) => {
        setTempFilters({
            ...tempFilters,
            is_deleted: { value: e.target.checked, matchMode: 'equals' },
        });
    };

    const handleCreateDateStartChange = (e: { value: Nullable<Date> }) => {
        setTempFilters({
            ...tempFilters,
            create_date_start: {
                value: formatDateFromFilter(e.value),
                matchMode: 'dateAfter'
            },
        });
    };

    const handleCreateDateEndChange = (e: { value: Nullable<Date> }) => {
        setTempFilters({
            ...tempFilters,
            create_date_end: {
                value: formatDateFromFilter(e.value),
                matchMode: 'dateBefore'
            },
        });
    };

    const handleReset = () => {
        setTempFilters(UserTableFilters);
        // The debounced effect will automatically trigger setFilterAction
    };

    return (
        <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex flex-col gap-1">
                <label htmlFor="search-global" className="text-sm font-medium">
                    ID / Email / Name
                </label>
                <div>
                    <IconField iconPosition="left">
                        <InputIcon>
                            <div className="flex items-center">
                                <Icons.Search className="w-4 h-4"/>
                            </div>
                        </InputIcon>
                        <InputText
                            id="search-global"
                            placeholder="Search"
                            value={tempFilters.global.value ?? ''}
                            onChange={handleTermChange}
                        />
                    </IconField>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="search-status" className="text-sm font-medium">
                    Status
                </label>
                <div>
                    <Dropdown
                        id="search-status"
                        value={tempFilters.status.value}
                        options={statuses}
                        onChange={handleStatusChange}
                        placeholder="-any-"
                        showClear
                    />
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="search-role" className="text-sm font-medium">
                    Role
                </label>
                <div>
                    <Dropdown
                        id="search-role"
                        value={tempFilters.role.value}
                        options={roles}
                        onChange={handleRoleChange}
                        placeholder="-any-"
                        showClear
                    />
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="search-create-date-start" className="text-sm font-medium">
                    Created Date
                </label>
                <div className="flex gap-2">
                    <div className="max-w-[180px] w-full">
                        <Calendar
                            id="search-create-date-start"
                            value={parseDate(tempFilters.create_date_start?.value)}
                            onChange={handleCreateDateStartChange}
                            placeholder="Start Date"
                            showIcon
                            maxDate={getValidDate(tempFilters.create_date_end?.value)}
                        />
                    </div>
                    <div className="max-w-[180px] w-full">
                        <Calendar
                            id="search-date-create-end"
                            value={parseDate(tempFilters.create_date_end?.value)}
                            onChange={handleCreateDateEndChange}
                            placeholder="End Date"
                            showIcon
                            className="max-w-[160px]"
                            minDate={getValidDate(tempFilters.create_date_start?.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-1 justify-center">
                <div>&nbsp;</div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        inputId="is_deleted"
                        checked={tempFilters.is_deleted?.value ?? false}
                        onChange={handleIsDeletedChange}
                    />
                    <label htmlFor="is_deleted" className="text-sm whitespace-nowrap">
                        Show Deleted
                    </label>
                </div>
            </div>
            <div className="flex items-end">
                <Button
                    onClick={handleReset}
                    severity="secondary"
                    text raised
                >
                    Reset Filters
                </Button>
            </div>
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


    // const handleDeleteSelected = () => {
    //     // Your delete logic here
    //     console.log('Deleting selected users:', selectedEntries);
    //     setSelectedEntries([]); // Clear selection after delete
    // };

    return (
        <div className="rounded-2xl p-4 bg-base-100">
            <Filters filters={filters} setFilterAction={setFilters} />
            <div className="mb-4 pt-4 border-t flex justify-between">
                <div className="flex items-center gap-2">
                    <div>
                        {selectedEntries.length} selected
                    </div>
                    {selectedEntries.length > 0 && (
                        <button className="btn btn-md btn-delete">
                            <Icons.Action.Delete className="w-4 h-4" />
                            Delete
                        </button>
                    )}
                </div>
                <div>
                    <button className="btn btn-create btn-sm">
                        <Icons.Action.Add className="w-4 h-4" />
                        Create user
                    </button>
                </div>
            </div>
            <DataTableList
                dataSource="users" dataKey="id" columns={TableColumns}
                filters={filters}
                selectionMode="multiple" onSelectionChange={handleSelectionChange} onRowSelect={onRowSelect} onRowUnselect={onRowUnselect}
            />
        </div>
    );
}