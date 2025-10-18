import type { Draft } from 'immer';
import type { StateCreator } from 'zustand';
import type { ModelStore } from '@/app/dashboard/_stores/model.store';
import type { DataSourceType } from '@/config/data-source';

export interface ModelModalSlice<K extends keyof DataSourceType> {
	isOpen: boolean;
	actionName: string | null;
	actionEntry: DataSourceType[K]['model'] | null;
	setActionEntry: (entry: DataSourceType[K]['model']) => void;
	openCreate: () => void;
	openUpdate: () => void;
	openAction: (name: string) => void;
	closeOut: () => void;
}

export const createModelModalSlice =
	<K extends keyof DataSourceType>(): StateCreator<
		ModelStore<K>,
		[['zustand/immer', never]],
		[],
		ModelModalSlice<K>
	> =>
	(set) => ({
		isOpen: false,
		actionName: null,
		actionEntry: null,

		openCreate: () =>
			set((state: Draft<ModelModalSlice<K>>) => {
				state.isOpen = true;
				state.actionName = 'create';
			}),

		openUpdate: () =>
			set((state: Draft<ModelModalSlice<K>>) => {
				state.isOpen = true;
				state.actionName = 'update';
			}),

		openAction: (name: string) =>
			set((state: Draft<ModelModalSlice<K>>) => {
				state.isOpen = true;
				state.actionName = name;
			}),

		setActionEntry: (entry) =>
			set((state: Draft<ModelModalSlice<K>>) => {
				state.actionEntry = entry as Draft<DataSourceType[K]['model']>;
			}),

		closeOut: () =>
			set((state: Draft<ModelModalSlice<K>>) => {
				state.isOpen = false;
				state.actionName = null;
				state.actionEntry = null;
			}),
	});
