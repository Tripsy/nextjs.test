'use client';

import {capitalizeFirstLetter} from '@/lib/utils/string';
import {UserEntryType, UserTableFiltersType} from '@/lib/services/user.service';
import {IconField} from 'primereact/iconfield';
import {InputIcon} from 'primereact/inputicon';
import {InputText} from 'primereact/inputtext';
import React, {ChangeEvent} from 'react';
import {Dropdown, DropdownChangeEvent} from 'primereact/dropdown';
import {UserRoleEnum, UserStatusEnum} from '@/lib/enums';
import {Icons} from '@/components/icon.component';
import {TableFilterBodyTemplateProps} from '@/app/dashboard/types/table-list.type';

const statuses = Object.values(UserStatusEnum).map((status) => ({
    label: capitalizeFirstLetter(status),
    value: status,
}));

const roles = Object.values(UserRoleEnum).map((role) => ({
    label: capitalizeFirstLetter(role),
    value: role,
}));

export const FilterBodyTemplate = ({
   filters,
   setFilterAction,
}: TableFilterBodyTemplateProps<UserTableFiltersType>): React.JSX.Element => {
    const handleGlobalChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterAction({
            ...filters,
            global: {value: e.target.value, matchMode: 'contains'},
        });
    };

    const handleStatusChange = (e: DropdownChangeEvent) => {
        setFilterAction({
            ...filters,
            status: {value: e.value, matchMode: 'equals'},
        });
    };

    const handleRoleChange = (e: DropdownChangeEvent) => {
        setFilterAction({
            ...filters,
            role: {value: e.value, matchMode: 'equals'},
        });
    };

    return (
        <div className="flex gap-x-4">
            <IconField iconPosition="left">
                <InputIcon>
                    <div className="flex items-center">
                        <Icons.Search className="w-4 h-4"/>
                    </div>
                </InputIcon>
                <InputText
                    placeholder="Search"
                    value={filters.global.value ?? ''}
                    onChange={handleGlobalChange}
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