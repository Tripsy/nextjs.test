'use client';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
import {FormPart} from '@/components/form/form-part.component';
import {FormElement} from '@/components/form/form-element.component';
import {DataTableFiltersUsersType} from '@/app/dashboard/users/users.definition';
import {useStore} from 'zustand/react';
import {useDataTable} from '@/app/dashboard/_providers/data-table-provider';
import {createFilterHandlers} from '@/lib/utils/data-table';
import {useDebouncedEffect} from '@/hooks';

const statuses = Object.values(UserStatusEnum).map((status) => ({
    label: capitalizeFirstLetter(status),
    value: status,
}));

const roles = Object.values(UserRoleEnum).map((role) => ({
    label: capitalizeFirstLetter(role),
    value: role,
}));

export const DataTableFiltersUsers = (): React.JSX.Element => {
    const {
        stateDefault,
        modelStore
    } = useDataTable();

    const filters = useStore(modelStore, (state) => state.tableState.filters);
    const updateTableState = useStore(modelStore, (state) => state.updateTableState);

    const updateFilters = useCallback((newFilters: Partial<DataTableFiltersUsersType>) => {
        updateTableState({
            filters: {...filters, ...newFilters}
        });
    }, [filters, updateTableState]);

    const [valueSearchGlobal, setValueSearchGlobal] = useState(filters.global?.value ?? '');

    const initialFilterValue = useRef(filters.global?.value ?? '');
    const currentSearchGlobal = useRef(filters.global?.value ?? '');
    const debouncedSearchGlobal = useRef('');
    const triggerSearchGlobal = useRef(false);

    useEffect(() => {
        const handleFilterReset = () => {
            updateTableState({
                filters: stateDefault.filters
            });

            setValueSearchGlobal('');
            initialFilterValue.current = '';
            currentSearchGlobal.current = '';
        };

        window.addEventListener('filterReset', handleFilterReset as EventListener);

        return () => {
            window.removeEventListener('filterReset', handleFilterReset as EventListener);
        };
    }, [stateDefault.filters, updateTableState]);

    const handlers = useMemo(() => createFilterHandlers<'users'>(updateFilters), [updateFilters]);
    const {
        handleTermChange,
        handleStatusChange,
        handleIsDeletedChange,
        handleCreateDateStartChange,
        handleCreateDateEndChange
    } = handlers;

    const handleSearchGlobalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setValueSearchGlobal(value);

        if (currentSearchGlobal.current !== value) {
            currentSearchGlobal.current = value;

            // Determine if we should trigger the search
            triggerSearchGlobal.current =
                // Case 1: User types 3+ characters (new search)
                (value.length > 2) ||
                // Case 2: User clears a previous search (from 3+ to less)
                (initialFilterValue.current.length > 2 && value.length < 3);

            debouncedSearchGlobal.current = value.length < 3 ? '' : value;
        }
    }, []);

    const handleRoleChange = useCallback(
        (e: DropdownChangeEvent) => updateFilters({role: {value: e.value, matchMode: 'equals'}}),
        [updateFilters]
    );

    useDebouncedEffect(() => {
        if (triggerSearchGlobal.current) {
            handleTermChange(debouncedSearchGlobal.current);

            initialFilterValue.current = currentSearchGlobal.current;
            triggerSearchGlobal.current = false;
        }
    }, [], 1000);

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
                            value={valueSearchGlobal}
                            onChange={handleSearchGlobalChange}
                        />
                    </IconField>
                </FormElement>
            </FormPart>

            <FormPart>
                <FormElement labelText="Status" labelFor="search-status">
                    <Dropdown
                        className="p-inputtext-sm"
                        panelStyle={{fontSize: '0.875rem'}}
                        id="search-status"
                        value={filters.status.value}
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
                        panelStyle={{fontSize: '0.875rem'}}
                        id="search-role"
                        value={filters.role.value}
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
                            value={stringToDate(filters.create_date_start?.value)}
                            onChange={handleCreateDateStartChange}
                            placeholder="Start Date"
                            showIcon
                            maxDate={getValidDate(filters.create_date_end?.value)}
                        />
                        <Calendar
                            className="p-inputtext-sm h-11 w-[160px]"
                            id="search-date-create-end"
                            value={stringToDate(filters.create_date_end?.value)}
                            onChange={handleCreateDateEndChange}
                            placeholder="End Date"
                            showIcon
                            minDate={getValidDate(filters.create_date_start?.value)}
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
                            checked={filters.is_deleted?.value ?? false}
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