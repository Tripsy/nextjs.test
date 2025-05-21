import {TableFetchParamsType, TableFetchResponseType} from '@/app/dashboard/components/table-list.component';
import {fetchData} from '@/lib/api';

export type FetchFilterUserType = {
    id?: number,
    name?: string,
    email?: string,
    status?: string,
    create_date_start?: string, // Y-m-d
    create_date_end?: string, // Y-m-d
    is_deleted?: boolean
}

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

export async function fetchUsers(params: TableFetchParamsType<FetchFilterUserType>): Promise<TableFetchResponseType<UserEntryType>> {
    const query = new URLSearchParams({
        order_by: String(params.order_by),
        direction: params.direction,
        limit: String(params.limit),
        page: String(params.page),
        filter: JSON.stringify(params.filter)
    });

    return await fetchData(`/users?${query}`) as TableFetchResponseType<UserEntryType>;
}


