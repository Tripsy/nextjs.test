import {DropdownChangeEvent} from 'primereact/dropdown';
import {CheckboxChangeEvent} from 'primereact/checkbox';
import React from 'react';
import {Nullable} from 'primereact/ts-helpers';
import {formatDate} from '@/lib/utils/date';

export type FiltersAction<FiltersType> =
    | { type: 'SET_TERM'; value: string }
    | { type: 'SET_STATUS'; value: string | null }
    | { type: 'SET_IS_DELETED'; value: boolean }
    | { type: 'SET_CREATE_DATE_START'; value: string | null }
    | { type: 'SET_CREATE_DATE_END'; value: string | null }
    | { type: 'SYNC'; state: FiltersType };

export function filtersReducer<FiltersType>(state: FiltersType, action: FiltersAction<FiltersType>): FiltersType {
    switch (action.type) {
        case 'SET_TERM':
            return {...state, global: {value: action.value, matchMode: 'contains'}};
        case 'SET_STATUS':
            return {...state, status: {value: action.value, matchMode: 'equals'}};
        case 'SET_IS_DELETED':
            return {...state, is_deleted: {value: action.value, matchMode: 'equals'}};
        case 'SET_CREATE_DATE_START':
            return {...state, create_date_start: {value: action.value, matchMode: 'dateAfter'}};
        case 'SET_CREATE_DATE_END':
            return {...state, create_date_end: {value: action.value, matchMode: 'dateBefore'}};
        case 'SYNC':
            return action.state;
        default:
            console.error('Unknown action type');
            return state;
    }
}

export function createFilterHandlers<FiltersType>(
    dispatch: React.Dispatch<FiltersAction<FiltersType>>
) {
    return {
        handleTermChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch({ type: 'SET_TERM', value: e.target.value }),

        handleStatusChange: (e: DropdownChangeEvent) =>
            dispatch({ type: 'SET_STATUS', value: e.value }),

        handleIsDeletedChange: (e: CheckboxChangeEvent) =>
            dispatch({ type: 'SET_IS_DELETED', value: e.target.checked || false }),

        handleCreateDateStartChange: (e: { value: Nullable<Date> }) =>
            dispatch({ type: 'SET_CREATE_DATE_START', value: formatDate(e.value) }),

        handleCreateDateEndChange: (e: { value: Nullable<Date> }) =>
            dispatch({ type: 'SET_CREATE_DATE_END', value: formatDate(e.value) }),

        handleReset: (defaultFilters: FiltersType) =>
            dispatch({ type: 'SYNC', state: defaultFilters }),
    };
}