import {TableFetchFunction} from '@/app/dashboard/types/table-list.type';
import {
    fetchUsers,
    UserTableFiltersType,
    UserEntryType,
    UserTableParams
} from '@/lib/services/user.service';
import {LazyStateType} from '@/app/dashboard/components/table-list.component';

export type ServicesTypes = {
    users: {
        filter: UserTableFiltersType;
        entry: UserEntryType;
    };
};

export const SERVICES: {
    [K in keyof ServicesTypes]: {
        fetchFunction: TableFetchFunction<ServicesTypes[K]['entry']>;
        defaultParams: LazyStateType<ServicesTypes[K]['filter']>;
    }
} = {
    users: {
        fetchFunction: fetchUsers,
        defaultParams: UserTableParams,
    },
};