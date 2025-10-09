import {
    DataSourceConfigUsers,
    DataSourceUsersType,
} from '@/app/dashboard/users/users.definition';
import React from 'react';
import {ResponseFetch} from '@/lib/utils/api';

export type FindFunctionParamsType = {
    order_by: string;
    direction: 'ASC' | 'DESC';
    limit: number;
    page: number;
    filter: string;
};

export type FindFunctionResponseType<Model> = {
    entries: Model[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
};

export type FindFunctionType<Model> = (
    params: FindFunctionParamsType
) => Promise<FindFunctionResponseType<Model> | undefined>;

export type CreateFunctionType<K extends keyof DataSourceType> = (
    data: DataSourceType[K]['formState']['values']
) => Promise<ResponseFetch<Partial<DataSourceType[K]['model']>>>;

export type UpdateFunctionType<K extends keyof DataSourceType> = (
    data: DataSourceType[K]['formState']['values'],
    id: number
) => Promise<ResponseFetch<Partial<DataSourceType[K]['model']>>>;

export type ValidateFormFunctionType<K extends keyof DataSourceType> = (
    values: DataSourceType[K]['formState']['values'],
    id?: number
) => DataSourceType[K]['validationResult'];

export type DataTableSelectionModeType = 'checkbox' | 'multiple' | null;

export type DataTableStateType<Filter> = {
    first: number;
    rows: number;
    sortField: string;
    sortOrder: 1 | 0 | -1 | null | undefined;
    filters: Filter;
};

export type DataTableColumnType<Model> = {
    field: keyof Model & string;
    header: string;
    sortable?: boolean;
    body?: (rowData: Model, column: DataTableColumnType<Model>) => React.JSX.Element | string;
    style?: React.CSSProperties;
};

export type DataSourceType = {
    users: DataSourceUsersType;
};

type DataSourceConfigType<K extends keyof DataSourceType> = {
    dataTableState: DataTableStateType<DataSourceType[K]['dataTableFilter']>;
    dataTableColumns: DataTableColumnType<DataSourceType[K]['model']>[];
    onRowSelect?: (entry: DataSourceType[K]['model']) => void;
    onRowUnselect?: (entry: DataSourceType[K]['model']) => void;
    findFunction: FindFunctionType<DataSourceType[K]['model']>;
    createFunction?: CreateFunctionType<K>;
    updateFunction?: UpdateFunctionType<K>;
    getFormValuesFunction?: (formData: FormData) => DataSourceType[K]['formState']['values'];
    validateFormFunction?: ValidateFormFunctionType<K>;
};

const DataSourceConfig: {
    [K in keyof DataSourceType]: DataSourceConfigType<K>
} = {
    users: DataSourceConfigUsers,
};

export type DataTablePropsType = {
    dataKey: string;
    scrollHeight?: string;
};

export function getDataSourceConfig<
    K extends keyof DataSourceType,
    P extends keyof (typeof DataSourceConfig)[K]
>(
    dataSource: K,
    prop: P
): (typeof DataSourceConfig)[K][P] {
    return DataSourceConfig[dataSource][prop];
}