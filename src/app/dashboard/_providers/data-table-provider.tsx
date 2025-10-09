'use client';

import React, {createContext, useState, ReactNode, useContext, useRef, useCallback, useMemo} from 'react';
import {DataSourceType, DataTableSelectionModeType, getDataSourceConfig, DataTableStateType} from '@/config/data-source';
import {useDebouncedEffect} from '@/hooks';
import {readFromLocalStorage} from '@/lib/utils/storage';
import {ManageStoreType} from '@/app/dashboard/_stores/manage.store';

type DataTableContextType<K extends keyof DataSourceType> = {
    dataSource: K;
    dataStorageKey: string;
    selectionMode: DataTableSelectionModeType;
    tableStateDefault: DataTableStateType<DataSourceType[K]['dataTableFilter']>;
    tableStateInit: DataTableStateType<DataSourceType[K]['dataTableFilter']>;
    filters: DataSourceType[K]['dataTableFilter'];
    setFilters: React.Dispatch<React.SetStateAction<DataSourceType[K]['dataTableFilter']>>;
    selectedEntries: DataSourceType[K]['model'][];
    setSelectedEntries: React.Dispatch<React.SetStateAction<DataSourceType[K]['model'][]>>;
    clearSelectedEntries: () => void;
    manageStore: ManageStoreType<K>;
};

const DataTableContext = createContext<DataTableContextType<keyof DataSourceType> | undefined>(undefined);

function DataTableProvider<K extends keyof DataSourceType>({
   dataSource,
   selectionMode,
   manageStore,
   children
}: {
    dataSource: K,
    selectionMode: DataTableSelectionModeType,
    manageStore: ManageStoreType<K>,
    children: ReactNode
}) {
    const dataStorageKey = useMemo(() => `data-table-state-${dataSource}`, [dataSource]);
    const tableStateDefault = getDataSourceConfig(dataSource, 'dataTableState');

    const tableStateInit = useMemo((): DataTableStateType<DataSourceType[K]['dataTableFilter']> => {
        return {
            ...tableStateDefault,
            ...(readFromLocalStorage<DataTableStateType<DataSourceType[K]['dataTableFilter']>>(dataStorageKey) || {})
        };
    }, [dataStorageKey, tableStateDefault]);

    const [filters, setFilters] = useState<DataSourceType[K]['dataTableFilter']>(tableStateInit.filters);
    const [selectedEntries, setSelectedEntries] = useState<DataSourceType[K]['model'][]>([]);

    const prevSelectedEntriesRef = useRef<DataSourceType[K]['model'][]>([]);

    const clearSelectedEntries = useCallback(() => {
        setSelectedEntries([]);
    }, []);

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

    return (
        <DataTableContext.Provider value={{
            dataSource,
            dataStorageKey,
            selectionMode,
            tableStateDefault,
            tableStateInit,
            filters,
            setFilters,
            selectedEntries,
            setSelectedEntries,
            clearSelectedEntries,
            manageStore
        }}>
            {children}
        </DataTableContext.Provider>
    );
}

function useDataTable<K extends keyof DataSourceType>() {
    const context = useContext(DataTableContext);

    if (!context) {
        throw new Error('useDataTable must be used within a DataTableProvider');
    }

    return context as unknown as DataTableContextType<K>;
}

export {DataTableProvider, useDataTable};
