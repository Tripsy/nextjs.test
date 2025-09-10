'use client';

import React, {createContext, useState, ReactNode, useContext, useRef, useCallback} from 'react';
import {DataSourceType, getDataSourceConfig} from '@/config/data-source';
import {useDebouncedEffect} from '@/hooks';
import {DataTableSelectionModeType} from '@/types/data-table.type';

type DataTableContextType<K extends keyof DataSourceType> = {
    dataSource: K;
    selectionMode: DataTableSelectionModeType;
    selectedEntries: DataSourceType[K]['entry'][];
    setSelectedEntries: React.Dispatch<React.SetStateAction<DataSourceType[K]['entry'][]>>;
    clearSelectedEntries: () => void;
    filters: DataSourceType[K]['filter'];
    setFilters: React.Dispatch<React.SetStateAction<DataSourceType[K]['filter']>>;
};

const DataTableContext = createContext<DataTableContextType<keyof DataSourceType> | undefined>(undefined);

function DataTableProvider<K extends keyof DataSourceType>({
    dataSource,
    selectionMode,
    defaultFilters,
    children,
}: {
    dataSource: K;
    selectionMode: DataTableSelectionModeType;
    defaultFilters: DataSourceType[K]['filter'];
    children: ReactNode;
}) {

    const [filters, setFilters] = useState<DataSourceType[K]['filter']>(defaultFilters);
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
        <DataTableContext.Provider value={{dataSource, selectionMode, selectedEntries, setSelectedEntries, clearSelectedEntries, filters, setFilters}}>
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
