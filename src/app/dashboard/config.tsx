import {LazyStateType, DataTableFindFunction} from '@/app/dashboard/types/data-table.type';
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
        findFunction: DataTableFindFunction<ServicesTypes[K]['entry']>;
        defaultParams: LazyStateType<ServicesTypes[K]['filter']>;
    }
} = {
    users: {
        findFunction: findUsers,
        defaultParams: UserTableParams,
    },
};