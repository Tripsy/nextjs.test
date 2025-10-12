import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {DataSourceType} from '@/config/data-source';
import {createModelModalSlice, ModelModalSlice} from './model-modal.slice';
import {createModelTableSlice, ModelTableSlice} from './model-table.slice';
import {createModelSelectionSlice, ModelSelectionSlice} from '@/app/dashboard/_stores/model-selection.slice';

export type ModelStore<K extends keyof DataSourceType> =
    ModelModalSlice<K> &
    ModelTableSlice<K> &
    ModelSelectionSlice<K> & {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
};

export const createModelStore = <K extends keyof DataSourceType>(dataSource: K) =>
    create<ModelStore<K>>()(
        devtools(
            persist(
                immer((set, get, store) => ({
                    ...createModelModalSlice<K>()(set, get, store),
                    ...createModelTableSlice<K>(dataSource)(set, get, store),
                    ...createModelSelectionSlice<K>()(set, get, store),
                    isLoading: false,
                    setLoading: (loading: boolean) => {
                        set((state) => {
                            state.isLoading = loading; // mutable style thanks to immer
                        });
                    },
                })),
                {
                    name: `model-store-${String(dataSource)}`, // unique key per store
                    // Only persist the parts you want
                    partialize: (state) => ({
                        tableState: state.tableState,
                        selectedEntries: state.selectedEntries,
                    }),
                }
            )
        )
    );


export type ModelStoreType<K extends keyof DataSourceType = keyof DataSourceType> =
    ReturnType<typeof createModelStore<K>>;
