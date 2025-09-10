'use client';

import {UserTableFiltersType, UserTableParams} from '@/lib/services/user.service';
import React, {useCallback} from 'react';
import {useDataTableFilters} from '@/hooks';
import {Dropdown, DropdownChangeEvent} from 'primereact/dropdown';
import {Checkbox} from 'primereact/checkbox';
import {capitalizeFirstLetter} from '@/lib/utils/string';
import {IconField} from 'primereact/iconfield';
import {InputIcon} from 'primereact/inputicon';
import {Icons} from '@/components/icon.component';
import {InputText} from 'primereact/inputtext';
import {Calendar} from 'primereact/calendar';
import {Button} from 'primereact/button';
import {UserRoleEnum, UserStatusEnum} from '@/lib/models/user.model';
import {getValidDate, stringToDate} from '@/lib/utils/date';
import {Loading} from '@/components/loading.component';
import {createFilterHandlers, FiltersAction, filtersReducer} from '@/reducers/dashboard/data-table-filters.reducer';

type FiltersActionUsers = FiltersAction<UserTableFiltersType> | { type: 'SET_ROLE'; value: string | null };

function filtersReducerUsers(state: UserTableFiltersType, action: FiltersActionUsers): UserTableFiltersType {
    switch (action.type) {
        case 'SET_ROLE':
            return {...state, role: {value: action.value, matchMode: 'equals'}};
        default:
            return filtersReducer<UserTableFiltersType>(state, action);
    }
}

const statuses = Object.values(UserStatusEnum).map((status) => ({
    label: capitalizeFirstLetter(status),
    value: status,
}));

const roles = Object.values(UserRoleEnum).map((role) => ({
    label: capitalizeFirstLetter(role),
    value: role,
}));

export const DataTableFiltersUsers = (): React.JSX.Element => {
    const {loading, tempFilters, dispatchFilters} = useDataTableFilters<'users'>(filtersReducerUsers);

    const {
        handleTermChange,
        handleStatusChange,
        handleIsDeletedChange,
        handleCreateDateStartChange,
        handleCreateDateEndChange
    } = createFilterHandlers(dispatchFilters as unknown as React.Dispatch<FiltersAction<UserTableFiltersType>>);

    const dispatchFiltersSpecific = dispatchFilters as React.Dispatch<FiltersActionUsers>;

    const handleRoleChange = useCallback(
        (e: DropdownChangeEvent) => dispatchFiltersSpecific({type: 'SET_ROLE', value: e.value}),
        [dispatchFiltersSpecific]
    );

    const handleReset = useCallback(() => {
        dispatchFilters({type: 'SYNC', state: UserTableParams.filters});
    }, [dispatchFilters]);

    // Show loading state while hydrating
    if (!loading) {
        return (
            <div className="flex justify-center items-center h-32 text-xl">
                <Loading text="Please wait..."/>
            </div>
        );
    }

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
                            value={stringToDate(tempFilters.create_date_start?.value)}
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
                            value={stringToDate(tempFilters.create_date_end?.value)}
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