import {LazyStateType, DataTableFindFunction} from '@/types/data-table.type';
import {
    findUser,
    UserTableFiltersType,
    UserTableParams
} from '@/lib/services/user.service';
import {UserModel} from '@/lib/models/user.model';

export type DataSourceType = {
    users: {
        filter: UserTableFiltersType;
        entry: UserModel;
    };
};

export const DataSourceConfig: {
    [K in keyof DataSourceType]: {
        findFunction: DataTableFindFunction<DataSourceType[K]['entry']>;
        defaultParams: LazyStateType<DataSourceType[K]['filter']>;
    }
} = {
    users: {
        findFunction: findUser,
        defaultParams: UserTableParams,
    },
};