import {TableFiltersType} from '@/app/dashboard/types/table-list.type';
import {UserTableFilters, UserTableFiltersType} from '@/lib/services/user.service';
import React, {useEffect, useState} from 'react';
import {useDebouncedEffect} from '@/app/hooks';
import {Dropdown, DropdownChangeEvent} from 'primereact/dropdown';
import {Checkbox, CheckboxChangeEvent} from 'primereact/checkbox';
import {Nullable} from 'primereact/ts-helpers';
import {capitalizeFirstLetter, formatDateFromFilter, getValidDate, parseDate} from '@/lib/utils/string';
import {IconField} from 'primereact/iconfield';
import {InputIcon} from 'primereact/inputicon';
import {Icons} from '@/components/icon.component';
import {InputText} from 'primereact/inputtext';
import {Calendar} from 'primereact/calendar';
import {Button} from 'primereact/button';
import {UserRoleEnum, UserStatusEnum} from '@/lib/enums';

export const DataTableFiltersUsers = ({
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

    const statuses = Object.values(UserStatusEnum).map((status) => ({
        label: capitalizeFirstLetter(status),
        value: status,
    }));

    const roles = Object.values(UserRoleEnum).map((role) => ({
        label: capitalizeFirstLetter(role),
        value: role,
    }));

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
                            className="p-inputtext-sm"
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
                        className="p-inputtext-sm"
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
                        className="p-inputtext-sm"
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
                            className="text-sm h-11"
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
                            className="text-sm h-11"
                            value={parseDate(tempFilters.create_date_end?.value)}
                            onChange={handleCreateDateEndChange}
                            placeholder="End Date"
                            showIcon
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
                    size="small"
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