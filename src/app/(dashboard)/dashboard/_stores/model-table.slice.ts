import type { Draft } from 'immer';
import type { StateCreator } from 'zustand';
import type { ModelStore } from '@/app/dashboard/_stores/model.store';
import {
	type DataSourceTableFilter,
	type DataSourceType,
	type DataTableStateType,
	getDataSourceConfig,
} from '@/config/data-source';

export interface ModelTableSlice<K extends keyof DataSourceType> {
	tableState: DataTableStateType<DataSourceTableFilter<K>>;
	updateTableState: (
		newState: Partial<DataTableStateType<DataSourceTableFilter<K>>>,
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
						(newState.filters as Draft<DataSourceTableFilter<K>>) ||
						state.tableState.filters,
				};
			}),

		refreshTableState: () => {
			set((state: Draft<ModelTableSlice<K>>) => {
				state.tableState.reloadTrigger =
					(state.tableState.reloadTrigger || 0) + 1;
			});
		},
	});
