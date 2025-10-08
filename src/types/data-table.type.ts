import React from 'react';
import {DataSourceType} from '@/config/data-source';

export type LazyStateType<TFilter> = {
    first: number;
    rows: number;
    sortField: string;
    sortOrder: 1 | 0 | -1 | null | undefined;
    filters: TFilter;
};

export type DataTableSelectionModeType = 'checkbox' | 'multiple' | null;

export type DataTablePropsType<T extends keyof DataSourceType> = {
    dataKey: string;
    columns: DataTableColumnsType<DataSourceType[T]['entry']>;
    scrollHeight?: string;
};

export type DataTableFindParamsType = {
    order_by: string;
    direction: 'ASC' | 'DESC';
    limit: number;
    page: number;
    filter: string;
};

export type DataTableFindResponseType<TEntry> = {
    entries: TEntry[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
};

export type DataTableFindFunctionType<TEntry> = (
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