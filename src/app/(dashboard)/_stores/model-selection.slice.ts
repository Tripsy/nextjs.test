import type { Draft } from 'immer';
import type { StateCreator } from 'zustand';
import type { ModelStore } from '@/app/(dashboard)/_stores/model.store';
import type { DataSourceModel, DataSourceType } from '@/config/data-source';

export interface ModelSelectionSlice<K extends keyof DataSourceType> {
	selectedEntries: DataSourceModel<K>[];
	setSelectedEntries: (entries: DataSourceModel<K>[]) => void;
	clearSelectedEntries: () => void;
}

export const createModelSelectionSlice =
	<K extends keyof DataSourceType>(): StateCreator<
		ModelStore<K>,
		[['zustand/immer', never]],
		[],
		ModelSelectionSlice<K>
	> =>
	(set) => ({
		selectedEntries: [],

		setSelectedEntries: (entries) =>
			set((state: Draft<ModelSelectionSlice<K>>) => {
				state.selectedEntries = entries as Draft<DataSourceModel<K>>[];
			}),

		clearSelectedEntries: () =>
			set((state: Draft<ModelSelectionSlice<K>>) => {
				state.selectedEntries = [];
			}),
	});
