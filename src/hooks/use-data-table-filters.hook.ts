import {FiltersAction, filtersReducer} from '@/reducers/dashboard/data-table-filters.reducer';
import {useEffect, useReducer} from 'react';
import {useDebouncedEffect} from '@/hooks/use-debounced-effect.hook';
import {useDataTable} from '@/providers/dashboard/data-table-provider';
import {DataSourceType} from '@/config/data-source';

export function useDataTableFilters<K extends keyof DataSourceType>(
    customReducer?: (state: DataSourceType[K]['filter'], action: FiltersAction<DataSourceType[K]['filter']>) => DataSourceType[K]['filter']
) {
    const reducer = customReducer ? customReducer : filtersReducer;

    const {filters, setFilters} = useDataTable<K>();
    const [tempFilters, dispatchFilters] = useReducer(reducer, filters);

    useEffect(() => {
        dispatchFilters({type: 'SYNC', state: filters});
    }, [filters]);

    useDebouncedEffect(() => {
        setFilters(tempFilters);
    }, [tempFilters], 1000);

    return {tempFilters, dispatchFilters};
}