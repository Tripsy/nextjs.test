import {FiltersAction, filtersReducer} from '@/reducers/dashboard/data-table-filters.reducer';
import {useEffect, useReducer} from 'react';
import {useDebouncedEffect} from '@/hooks/use-debounced-effect.hook';
import {useDataTable} from '@/app/dashboard/_providers/data-table-provider';
import {DataSourceType} from '@/config/data-source';

export function useDataTableFilters<K extends keyof DataSourceType>(
    customReducer?: (state: DataSourceType[K]['dataTableFilter'], action: FiltersAction<DataSourceType[K]['dataTableFilter']>) => DataSourceType[K]['dataTableFilter']
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