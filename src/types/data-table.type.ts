import React from 'react';
import {DataSourceType} from '@/config/data-source';

export type LazyStateType<TFilter> = {
    first: number;
    rows: number;
    sortField: string;
    sortOrder: 1 | 0 | -1 | null | undefined;
    filters: TFilter;
};

export type DataTablePropsType<T extends keyof DataSourceType> = {
    dataSource: T;
    dataKey: string;
    columns: DataTableColumnsType<DataSourceType[T]['entry']>;
    filters: DataSourceType[T]['filter'];
    selectionMode: 'checkbox' | 'multiple' | null;
    onRowSelect?: (entry: DataSourceType[T]['entry']) => void;
    onRowUnselect?: (entry: DataSourceType[T]['entry']) => void;
    onSelectionChange?: (selectedEntries: DataSourceType[T]['entry'][]) => void;
    scrollHeight?: string;
};

export type DataTableFindParamsFilterType = Record<string, string | number | boolean>;

export type DataTableFindParamsType = {
    order_by: string;
    direction: 'ASC' | 'DESC';
    limit: number;
    page: number;
    filter: DataTableFindParamsFilterType;
};

export type DataTableFindResponseType<TEntry> = {
    entries: TEntry[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
};

export type DataTableFindFunction<TEntry> = (
    params: DataTableFindParamsType
) => Promise<DataTableFindResponseType<TEntry> | undefined>;

export type DataTableColumnType<TEntry> = {
    field: keyof TEntry & string;
    header: string;
    sortable?: boolean;
    body?: (rowData: TEntry, column: DataTableColumnType<TEntry>) => React.JSX.Element | string;
    style?: React.CSSProperties;
};

export type DataTableColumnsType<TEntry> = DataTableColumnType<TEntry>[];

export type TableFiltersType<TFilter> = {
    filters: TFilter;
    setFilterAction: (filters: TFilter) => void;
};