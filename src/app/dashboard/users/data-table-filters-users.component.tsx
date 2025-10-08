'use client';

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
import {UserRoleEnum, UserStatusEnum} from '@/lib/models/user.model';
import {getValidDate, stringToDate} from '@/lib/utils/date';
import {createFilterHandlers, FiltersAction, filtersReducer} from '@/reducers/dashboard/data-table-filters.reducer';
import {FormPart} from '@/components/form/form-part.component';
import {FormElement} from '@/components/form/form-element.component';
import {UsersTableFiltersType} from '@/app/dashboard/users/users.definition';

type FiltersActionUsers = FiltersAction<UsersTableFiltersType> | { type: 'SET_ROLE'; value: string | null };

function filtersReducerUsers(state: UsersTableFiltersType, action: FiltersActionUsers): UsersTableFiltersType {
    switch (action.type) {
        case 'SET_ROLE':
            return {...state, role: {value: action.value, matchMode: 'equals'}};
        default:
            return filtersReducer<UsersTableFiltersType>(state, action);
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
    const {tempFilters, dispatchFilters} = useDataTableFilters<'users'>(filtersReducerUsers);

    const {
        handleTermChange,
        handleStatusChange,
        handleIsDeletedChange,
        handleCreateDateStartChange,
        handleCreateDateEndChange
    } = createFilterHandlers(dispatchFilters as unknown as React.Dispatch<FiltersAction<UsersTableFiltersType>>);

    const dispatchFiltersSpecific = dispatchFilters as React.Dispatch<FiltersActionUsers>;

    const handleRoleChange = useCallback(
        (e: DropdownChangeEvent) => dispatchFiltersSpecific({type: 'SET_ROLE', value: e.value}),
        [dispatchFiltersSpecific]
    );

    return (
        <div className="form-section flex-row flex-wrap gap-4 mb-4">
            <FormPart>
                <FormElement labelText="ID / Email / Name" labelFor="search-global">
                    <IconField iconPosition="left">
                        <InputIcon className="flex items-center">
                            <Icons.Search className="w-4 h-4"/>
                        </InputIcon>
                        <InputText
                            className="p-inputtext-sm"
                            id="search-global"
                            placeholder="Search"
                            value={tempFilters.global.value ?? ''}
                            onChange={handleTermChange}
                        />
                    </IconField>
                </FormElement>
            </FormPart>

            <FormPart>
                <FormElement labelText="Status" labelFor="search-status">
                    <Dropdown
                        className="p-inputtext-sm"
                        panelStyle={{ fontSize: '0.875rem' }}
                        id="search-status"
                        value={tempFilters.status.value}
                        options={statuses}
                        onChange={handleStatusChange}
                        placeholder="-any-"
                        showClear
                    />
                </FormElement>
            </FormPart>

            <FormPart>
                <FormElement labelText="Role" labelFor="search-role">
                    <Dropdown
                        className="p-inputtext-sm"
                        panelStyle={{ fontSize: '0.875rem' }}
                        id="search-role"
                        value={tempFilters.role.value}
                        options={roles}
                        onChange={handleRoleChange}
                        placeholder="-any-"
                        showClear
                    />
                </FormElement>
            </FormPart>

            <FormPart>
                <FormElement labelText="Created Date" labelFor="search-create-date-start">
                    <div className="flex gap-2">
                        <Calendar
                            className="p-inputtext-sm h-11 w-[160px]"
                            id="search-create-date-start"
                            value={stringToDate(tempFilters.create_date_start?.value)}
                            onChange={handleCreateDateStartChange}
                            placeholder="Start Date"
                            showIcon
                            maxDate={getValidDate(tempFilters.create_date_end?.value)}
                        />
                        <Calendar
                            className="p-inputtext-sm h-11 w-[160px]"
                            id="search-date-create-end"
                            value={stringToDate(tempFilters.create_date_end?.value)}
                            onChange={handleCreateDateEndChange}
                            placeholder="End Date"
                            showIcon
                            minDate={getValidDate(tempFilters.create_date_start?.value)}
                        />
                    </div>
                </FormElement>
            </FormPart>

            <FormPart className="flex flex-col justify-center">
                <>
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
                </>
            </FormPart>
        </div>
    );
};