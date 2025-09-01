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
    columns: DataTableColumnsType;
    filters: DataSourceType[T]['filter'];
    selectionMode: 'checkbox' | 'multiple' | null;
    onRowSelect?: (entry: DataSourceType[T]['entry']) => void;
    onRowUnselect?: (entry: DataSourceType[T]['entry']) => void;
    onSelectionChange?: (selectedEntries: DataSourceType[T]['entry'][]) => void;
    scrollHeight?: string;
};

export type DataTableFindParamsType = {
    order_by: string;
    direction: 'ASC' | 'DESC';
    limit: number;
    page: number;
    filter: Record<string, any>;
};

export type DataTableFindResponseType<TEntry = Record<string, any>> = {
    entries: TEntry[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
};

export type DataTableFindFunction<TEntry = Record<string, any>> = (
    params: DataTableFindParamsType
) => Promise<DataTableFindResponseType<TEntry>>;

export type DataTableColumnType = {
    field: string;
    header: string;
    sortable?: boolean;
    body?: (rowData: any, column: DataTableColumnType) => React.JSX.Element | string;
    style?: React.CSSProperties;
};

export type DataTableColumnsType = DataTableColumnType[];

export type TableFiltersType<TFilter> = {
    filters: TFilter;
    setFilterAction: (filters: TFilter) => void;
};