import {StateCreator} from 'zustand';
import {DataSourceType} from '@/config/data-source';
import {Draft} from 'immer';
import {ModelStore} from '@/app/dashboard/_stores/model.store';

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
                    state.selectedEntries = entries as Draft<DataSourceType[K]['model']>[];
                }),

            clearSelectedEntries: () =>
                set((state: Draft<ModelSelectionSlice<K>>) => {
                    state.selectedEntries = [];
                }),
        });
