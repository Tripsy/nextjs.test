'use client';

import React, {createContext, useState, ReactNode, useContext, useRef, useCallback, useMemo} from 'react';
import {DataSourceType, getDataSourceConfig} from '@/config/data-source';
import {useDebouncedEffect} from '@/hooks';
import {DataTableSelectionModeType, LazyStateType} from '@/types/data-table.type';
import {readFromLocalStorage} from '@/lib/utils/storage';

type DataTableContextType<K extends keyof DataSourceType> = {
    dataSource: K;
    dataStorageKey: string;
    selectionMode: DataTableSelectionModeType;
    defaultState: LazyStateType<DataSourceType[K]['filter']>;
    initState: LazyStateType<DataSourceType[K]['filter']>;
    filters: DataSourceType[K]['filter'];
    setFilters: React.Dispatch<React.SetStateAction<DataSourceType[K]['filter']>>;
    selectedEntries: DataSourceType[K]['entry'][];
    setSelectedEntries: React.Dispatch<React.SetStateAction<DataSourceType[K]['entry'][]>>;
    clearSelectedEntries: () => void;
};

const DataTableContext = createContext<DataTableContextType<keyof DataSourceType> | undefined>(undefined);

function DataTableProvider<K extends keyof DataSourceType>({
   dataSource,
   selectionMode,
   defaultState,
   children
}: {
    dataSource: K,
    selectionMode: DataTableSelectionModeType,
    defaultState: LazyStateType<DataSourceType[K]['filter']>
    children: ReactNode
}) {
    const dataStorageKey = useMemo(() => `data-table-state-${dataSource}`, [dataSource]);

    const initState = useMemo((): LazyStateType<DataSourceType[K]['filter']> => {
        return {
            ...defaultState,
            ...(readFromLocalStorage<LazyStateType<DataSourceType[K]['filter']>>(dataStorageKey) || {})
        };
    }, [dataStorageKey, defaultState]);

    const [filters, setFilters] = useState<DataSourceType[K]['filter']>(initState.filters);
    const [selectedEntries, setSelectedEntries] = useState<DataSourceType[K]['entry'][]>([]);

    const prevSelectedEntriesRef = useRef<DataSourceType[K]['entry'][]>([]);

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
            defaultState,
            initState,
            filters,
            setFilters,
            selectedEntries,
            setSelectedEntries,
            clearSelectedEntries
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
