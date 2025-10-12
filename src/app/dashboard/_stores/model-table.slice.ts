import {StateCreator} from 'zustand';
import {DataSourceType, DataTableStateType, getDataSourceConfig} from '@/config/data-source';
import {Draft} from 'immer';
import {ModelStore} from '@/app/dashboard/_stores/model.store';

export interface ModelTableSlice<K extends keyof DataSourceType> {
    tableState: DataTableStateType<DataSourceType[K]['dataTableFilter']>;
    updateTableState: (newState: Partial<DataTableStateType<DataSourceType[K]['dataTableFilter']>>) => void;
    // getStateFilters: () => DataSourceType[K]['dataTableFilter'];
}

export const createModelTableSlice =
    <K extends keyof DataSourceType>(dataSource: K): StateCreator<
        ModelStore<K>,
        [['zustand/immer', never]],
        [],
        ModelTableSlice<K>
    > =>
        (set) => ({
            tableState: getDataSourceConfig(dataSource, 'dataTableState'),

            updateTableState: (newState) =>
                set((state: Draft<ModelTableSlice<K>>) => {
                    state.tableState = {
                        ...state.tableState,
                        ...newState,
                        filters: newState.filters as Draft<DataSourceType[K]['dataTableFilter']> || state.tableState.filters
                    };
                }),

            // getStateFilters: () => get().tableState.filters,
        });
