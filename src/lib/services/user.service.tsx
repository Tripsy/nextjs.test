import {ApiRequest, getResponseData} from '@/lib/api';
import {DataTableFilterMetaData} from 'primereact/datatable';
import {
    LazyStateType,
    DataTableFindParamsType,
    DataTableFindResponseType
} from '@/app/dashboard/types/data-table.type';
import {UserModel} from '@/lib/models/user.model';

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

export const UserTableParams: LazyStateType<UserTableFiltersType> = {
    first: 0,
    rows: 10,
    sortField: 'id',
    sortOrder: -1,
    filters: UserTableFilters
};

export const findUser = async (params: DataTableFindParamsType): Promise<DataTableFindResponseType<UserModel>> => {
    const query = new URLSearchParams({
        order_by: String(params.order_by),
        direction: params.direction,
        limit: String(params.limit),
        page: String(params.page),
        filter: JSON.stringify(params.filter)
    });

    const response = await new ApiRequest()
        .doFetch(`/users?${query}`);

    return getResponseData(response);
}