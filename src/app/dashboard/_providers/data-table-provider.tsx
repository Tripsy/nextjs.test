'use client';

import React, {createContext,ReactNode, useContext, useRef, useMemo} from 'react';
import {DataSourceType, DataTableSelectionModeType, getDataSourceConfig, DataTableStateType} from '@/config/data-source';
import {useDebouncedEffect} from '@/hooks';
import {useStore} from 'zustand/react';
import {ModelStoreType} from '@/app/dashboard/_stores/model.store';

type DataTableContextType<K extends keyof DataSourceType> = {
    dataSource: K;
    dataStorageKey: string;
    selectionMode: DataTableSelectionModeType;
    stateDefault: DataTableStateType<DataSourceType[K]['dataTableFilter']>;
    modelStore: ModelStoreType<K>;
};

const DataTableContext = createContext<DataTableContextType<keyof DataSourceType> | undefined>(undefined);

function DataTableProvider<K extends keyof DataSourceType>({
   dataSource,
   selectionMode,
   modelStore,
   children
}: {
    dataSource: K,
    selectionMode: DataTableSelectionModeType,
    modelStore: ModelStoreType,
    children: ReactNode
}) {
    const dataStorageKey = useMemo(() => `data-table-state-${dataSource}`, [dataSource]);
    const stateDefault = getDataSourceConfig(dataSource, 'dataTableState');

    const selectedEntries = useStore(modelStore, (state) => state.selectedEntries);

    const prevSelectedEntriesRef = useRef<DataSourceType[K]['model'][]>([]);

    useDebouncedEffect(() => {
        const onRowSelect = getDataSourceConfig(dataSource, 'onRowSelect');
        const onRowUnselect = getDataSourceConfig(dataSource, 'onRowUnselect');

        const prevSelected = prevSelectedEntriesRef.current;

        if (onRowSelect && selectedEntries.length === 1) {
            onRowSelect(selectedEntries[0]);
        }

        if (onRowUnselect && selectedEntries.length === 0 && prevSelected.length === 1) {
            onRowUnselect(prevSelected[0]);
        }

        prevSelectedEntriesRef.current = selectedEntries;
    }, [selectedEntries], 1000);

    console.log('DataTableProvider render');

    return (
        <DataTableContext.Provider value={{
            dataSource,
            dataStorageKey,
            selectionMode,
            stateDefault,
            modelStore
        }}>
            {children}
        </DataTableContext.Provider>
    );
}

function useDataTable() {
    const context = useContext(DataTableContext);

    if (!context) {
        throw new Error('useDataTable must be used within a DataTableProvider');
    }

    return context;
}

export {DataTableProvider, useDataTable};
