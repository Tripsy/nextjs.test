import {LazyStateType, DataTableFindFunction} from '@/types/data-table.type';
import {
    findUser,
    UserTableFiltersType,
    UserTableDefaultState
} from '@/lib/services/user.service';
import {UserModel} from '@/lib/models/user.model';

export type DataSourceType = {
    users: {
        filter: UserTableFiltersType;
        entry: UserModel;
    };
};

const DataSourceConfig: {
    [K in keyof DataSourceType]: {
        defaultState: LazyStateType<DataSourceType[K]['filter']>;
        findFunction: DataTableFindFunction<DataSourceType[K]['entry']>;
        onRowSelect?: (entry: DataSourceType[K]['entry']) => void;
        onRowUnselect?: (entry: DataSourceType[K]['entry']) => void;
    }
} = {
    users: {
        defaultState: UserTableDefaultState,
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