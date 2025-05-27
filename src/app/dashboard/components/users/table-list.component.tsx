'use client';

import {capitalizeFirstLetter} from '@/lib/utils/string';
import {UserEntryType, UserTableFiltersType} from '@/lib/services/user.service';
import {IconField} from 'primereact/iconfield';
import {InputIcon} from 'primereact/inputicon';
import {InputText} from 'primereact/inputtext';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {Dropdown, DropdownChangeEvent} from 'primereact/dropdown';
import {UserRoleEnum, UserStatusEnum} from '@/lib/enums';
import {Icons} from '@/components/icon.component';
import {TableFilterBodyTemplateProps} from '@/app/dashboard/components/table-list.component';

const statuses = Object.values(UserStatusEnum).map((status) => ({
    label: capitalizeFirstLetter(status),
    value: status,
}));

const roles = Object.values(UserRoleEnum).map((role) => ({
    label: capitalizeFirstLetter(role),
    value: role,
}));

export const FilterBodyTemplate= ({
   filters,
   setFilterAction,
}: TableFilterBodyTemplateProps<UserTableFiltersType>): React.JSX.Element => {
    const [term, setTerm] = useState<string | null>(filters.global.value || '');
    const [selectedStatus, setSelectedStatus] = useState<UserStatusEnum | null>(filters.status.value || null);
    const [selectedRole, setSelectedRole] = useState<UserRoleEnum | null>(filters.role.value || null);

    useEffect(() => {
        setFilterAction({
            global: { value: term, matchMode: 'contains' },
            status: { value: selectedStatus, matchMode: 'equals' },
            role: { value: selectedRole, matchMode: 'equals' },
        });
    }, [term, selectedStatus, selectedRole]);

    return (
        <div className="flex gap-x-4">
            <IconField iconPosition="left">
                <InputIcon>
                    <div className="flex items-center">
                        <Icons.Search className="w-4 h-4" />
                    </div>
                </InputIcon>
                <InputText placeholder="Search" value={term ?? ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setTerm(e.target.value)} />
            </IconField>

            <Dropdown
                value={selectedStatus}
                options={statuses}
                onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)}
                placeholder="Status"
                showClear
            />

            <Dropdown
                value={selectedRole}
                options={roles}
                onChange={(e: DropdownChangeEvent) => setSelectedRole(e.value)}
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