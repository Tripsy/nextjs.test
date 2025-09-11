import {FiltersAction, filtersReducer} from '@/reducers/dashboard/data-table-filters.reducer';
import {useEffect, useReducer, useState} from 'react';
import {useDebouncedEffect} from '@/hooks/use-debounced-effect.hook';
import {readFromLocalStorage} from '@/lib/utils/storage';
import {LazyStateType} from '@/types/data-table.type';
import {useDataTable} from '@/providers/dashboard/data-table-provider';
import {DataSourceType} from '@/config/data-source';

export function useDataTableFilters<K extends keyof DataSourceType>(
    customReducer?: (state: DataSourceType[K]['filter'], action: FiltersAction<DataSourceType[K]['filter']>) => DataSourceType[K]['filter']
) {
    const reducer = customReducer ? customReducer : filtersReducer;

    const {dataStorageKey, defaultFilters, filters, setFilters} = useDataTable<K>();
    const [loading, setLoading] = useState(false);
    const [tempFilters, dispatchFilters] = useReducer(reducer, filters);

    useEffect(() => {
        const savedState = readFromLocalStorage<LazyStateType<DataSourceType[K]['filter']>>(dataStorageKey);

        if (savedState?.filters) {
            setFilters(savedState.filters);
        }

        setLoading(true);
    }, [dataStorageKey, setFilters]);

    useEffect(() => {
        dispatchFilters({type: 'SYNC', state: filters});
    }, [filters]);

    useDebouncedEffect(() => {
        setFilters(tempFilters);
    }, [tempFilters], 1000);

    return {loading, defaultFilters, tempFilters, dispatchFilters};
}