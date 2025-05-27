import {
    TableFetchParamsType,
    TableFetchResponseType
} from '@/app/dashboard/components/table-list.component';
import {fetchData} from '@/lib/api';
import {DataTableFilterMetaData} from 'primereact/datatable';

export type UserTableFiltersType = {
    global: DataTableFilterMetaData;
    role: DataTableFilterMetaData;
    status: DataTableFilterMetaData;
    create_date_start: DataTableFilterMetaData;
    create_date_end: DataTableFilterMetaData;
    is_deleted: DataTableFilterMetaData;
};

export const UserTableFilters: UserTableFiltersType = {
    global: {value: null, matchMode: 'contains'},
    role: {value: null, matchMode: 'equals'},
    status: {value: null, matchMode: 'equals'},
    create_date_start: {value: null, matchMode: 'equals'},
    create_date_end: {value: null, matchMode: 'equals'},
    is_deleted: {value: null, matchMode: 'equals'},
};

export type UserEntryType = {
    id: number;
    name: string;
    email: string;
    status: string;
    language: string;
    role: string;
    created_at: string;
    updated_at: string;
};

export async function fetchUsers(params: TableFetchParamsType): Promise<TableFetchResponseType<UserEntryType>> {
    const query = new URLSearchParams({
        order_by: String(params.order_by),
        direction: params.direction,
        limit: String(params.limit),
        page: String(params.page),
        filter: JSON.stringify(params.filter)
    });

    return await fetchData(`/users?${query}`) as TableFetchResponseType<UserEntryType>;
}


