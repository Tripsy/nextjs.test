import {LazyStateType, DataTableFindFunctionType} from '@/types/data-table.type';
import {
    findUser
} from '@/lib/services/users.service';
import {UserModel} from '@/lib/models/user.model';
import {UsersTableFiltersType, UsersTableState} from '@/app/dashboard/users/users.definition';

export type DataSourceType = {
    users: {
        filter: UsersTableFiltersType;
        entry: UserModel;
    };
};

const DataSourceConfig: {
    [K in keyof DataSourceType]: {
        defaultState: LazyStateType<DataSourceType[K]['filter']>;
        findFunction: DataTableFindFunctionType<DataSourceType[K]['entry']>;
        onRowSelect?: (entry: DataSourceType[K]['entry']) => void;
        onRowUnselect?: (entry: DataSourceType[K]['entry']) => void;
    }
} = {
    users: {
        defaultState: UsersTableState,
        findFunction: findUser,
        onRowSelect: (entry: UserModel) => console.log('selected', entry),
        onRowUnselect: (entry: UserModel) => console.log('unselected', entry),
    },
};

export function getDataSourceConfig<
    K extends keyof DataSourceType,
    P extends keyof typeof DataSourceConfig[K]
>(dataSource: K, prop: P): (typeof DataSourceConfig)[K][P] {
    return DataSourceConfig[dataSource][prop];
}