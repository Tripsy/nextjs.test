import {StateCreator} from 'zustand';
import {DataSourceType} from '@/config/data-source';
import {Draft} from 'immer';
import {ModelStore} from '@/app/dashboard/_stores/model.store';

export interface ModelModalSlice<K extends keyof DataSourceType> {
    isCreateOpen: boolean;
    isUpdateOpen: boolean;
    isOperationOpen: boolean;
    updatedEntry: DataSourceType[K]['model'] | null;
    openCreate: () => void;
    openUpdate: (entry: DataSourceType[K]['model']) => void;
    openOperation: () => void;
    close: () => void;
}

export const createModelModalSlice =
    <K extends keyof DataSourceType>(): StateCreator<
        ModelStore<K>,
        [['zustand/immer', never]],
        [],
        ModelModalSlice<K>
    > =>
        (set) => ({
            isCreateOpen: false,
            isUpdateOpen: false,
            isOperationOpen: false,
            updatedEntry: null,

            openCreate: () =>
                set((state: Draft<ModelModalSlice<K>>) => {
                    state.isCreateOpen = true;
                }),

            openUpdate: (entry) =>
                set((state: Draft<ModelModalSlice<K>>) => {
                    state.isUpdateOpen = true;
                    state.updatedEntry = entry as Draft<DataSourceType[K]['model']>;
                }),

            openOperation: () =>
                set((state: Draft<ModelModalSlice<K>>) => {
                    state.isOperationOpen = true;
                }),

            close: () =>
                set((state: Draft<ModelModalSlice<K>>) => {
                    state.isCreateOpen = false;
                    state.isUpdateOpen = false;
                    state.isOperationOpen = false;
                    state.updatedEntry = null;
                }),
        });
