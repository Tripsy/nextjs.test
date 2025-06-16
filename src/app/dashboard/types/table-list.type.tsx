import React from 'react';

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