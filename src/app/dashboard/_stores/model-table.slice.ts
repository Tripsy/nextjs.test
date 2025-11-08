import type { Draft } from 'immer';
import type { StateCreator } from 'zustand';
import type { ModelStore } from '@/app/dashboard/_stores/model.store';
import {
	type DataSourceType,
	type DataTableStateType,
	getDataSourceConfig,
} from '@/config/data-source';

export interface ModelTableSlice<K extends keyof DataSourceType> {
	tableState: DataTableStateType<DataSourceType[K]['dataTableFilter']>;
	updateTableState: (
		newState: Partial<
			DataTableStateType<DataSourceType[K]['dataTableFilter']>
		>,
	) => void;
	refreshTableState: () => void;
}

export const createModelTableSlice =
	<K extends keyof DataSourceType>(
		dataSource: K,
	): StateCreator<
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
					filters:
						(newState.filters as Draft<
							DataSourceType[K]['dataTableFilter']
						>) || state.tableState.filters,
				};
			}),

		refreshTableState: () => {
			set((state: Draft<ModelTableSlice<K>>) => {
				state.tableState.reloadTrigger =
					(state.tableState.reloadTrigger || 0) + 1;
			});
		},
	});
