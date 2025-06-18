import {LazyStateType, TableFetchFunction} from '@/app/dashboard/types/table-list.type';
import {
    findUsers,
    UserTableFiltersType,
    UserEntryType,
    UserTableParams
} from '@/lib/services/user.service';

export type ServicesTypes = {
    users: {
        filter: UserTableFiltersType;
        entry: UserEntryType;
    };
};

export const SERVICES: {
    [K in keyof ServicesTypes]: {
        findFunction: TableFetchFunction<ServicesTypes[K]['entry']>;
        defaultParams: LazyStateType<ServicesTypes[K]['filter']>;
    }
} = {
    users: {
        findFunction: findUsers,
        defaultParams: UserTableParams,
    },
};