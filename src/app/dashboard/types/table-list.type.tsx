import React from 'react';
import {ServicesTypes} from '@/app/dashboard/config';

export type LazyStateType<TFilter> = {
    first: number;
    rows: number;
    sortField: string;
    sortOrder: 1 | 0 | -1 | null | undefined;
    filters: TFilter;
};

export type TablePropsType<T extends keyof ServicesTypes> = {
    dataSource: T;
    dataKey: string;
    columns: TableColumnsType;
    filters: ServicesTypes[T]['filter'];
    selectionMode: 'checkbox' | 'multiple' | null;
    onRowSelect?: (entry: ServicesTypes[T]['entry']) => void;
    onRowUnselect?: (entry: ServicesTypes[T]['entry']) => void;
    onSelectionChange?: (selectedEntries: ServicesTypes[T]['entry'][]) => void;
    scrollHeight?: string;
};

export type TableFetchParamsType = {
    order_by: string;
    direction: 'ASC' | 'DESC';
    limit: number;
    page: number;
    filter: Record<string, any>;
};

export type TableFetchResponseType<TEntry = Record<string, any>> = {
    entries: TEntry[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
};

export type TableFetchFunction<TEntry = Record<string, any>> = (
    params: TableFetchParamsType
) => Promise<TableFetchResponseType<TEntry>>;

export type TableColumn = {
    field: string;
    header: string;
    sortable?: boolean;
    body?: (rowData: any, column: TableColumn) => React.JSX.Element | string;
    style?: React.CSSProperties;
};

export type TableColumnsType = TableColumn[];

export type TableFiltersType<TFilter> = {
    filters: TFilter;
    setFilterAction: (filters: TFilter) => void;
};