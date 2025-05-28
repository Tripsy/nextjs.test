import {TableFetchFunction} from '@/app/dashboard/types/table-list.type';
import {fetchUsers, UserTableFiltersType, UserEntryType, UserTableFilters} from '@/lib/services/user.service';

export type ServicesTypes = {
    users: {
        filter: UserTableFiltersType;
        entry: UserEntryType;
    };
};

export const SERVICES: {
    [K in keyof ServicesTypes]: {
        fetchFunction: TableFetchFunction<ServicesTypes[K]['entry']>;
    }
} = {
    users: {
        fetchFunction: fetchUsers,
    },
};