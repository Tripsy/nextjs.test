import {LazyStateType, DataTableFindFunction} from '@/app/dashboard/types/data-table.type';
import {
    findUser,
    UserTableFiltersType,
    UserTableParams
} from '@/lib/services/user.service';
import {UserModel} from '@/lib/models/user.model';

export type ServicesTypes = {
    users: {
        filter: UserTableFiltersType;
        entry: UserModel;
    };
};

export const SERVICES: {
    [K in keyof ServicesTypes]: {
        findFunction: DataTableFindFunction<ServicesTypes[K]['entry']>;
        defaultParams: LazyStateType<ServicesTypes[K]['filter']>;
    }
} = {
    users: {
        findFunction: findUser,
        defaultParams: UserTableParams,
    },
};