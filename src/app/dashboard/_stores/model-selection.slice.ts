import type { Draft } from 'immer';
import type { StateCreator } from 'zustand';
import type { ModelStore } from '@/app/dashboard/_stores/model.store';
import type { DataSourceType } from '@/config/data-source';

export interface ModelSelectionSlice<K extends keyof DataSourceType> {
	selectedEntries: DataSourceType[K]['model'][];
	setSelectedEntries: (entries: DataSourceType[K]['model'][]) => void;
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
				state.selectedEntries = entries as Draft<
					DataSourceType[K]['model']
				>[];
			}),

		clearSelectedEntries: () =>
			set((state: Draft<ModelSelectionSlice<K>>) => {
				state.selectedEntries = [];
			}),
	});
