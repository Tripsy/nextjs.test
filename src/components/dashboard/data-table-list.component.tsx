'use client';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {DataTable, DataTablePageEvent, DataTableSortEvent} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {useDebouncedEffect} from '@/hooks';
import {DataSourceConfig, DataSourceType} from '@/config/data-source';
import {
    LazyStateType,
    DataTableColumnType,
    DataTablePropsType, DataTableFindParamsFilterType
} from '@/types/data-table.type';
import {readFromLocalStorage} from '@/lib/utils/storage';
import isEqual from 'fast-deep-equal';
import {PaginatorCurrentPageReportOptions} from 'primereact/paginator';

type SelectionChangeEvent<T> = {
    originalEvent: React.SyntheticEvent;
    value: T[];
};

export default function DataTableList<T extends keyof DataSourceType>(props: DataTablePropsType<T>) {
    const tableStateKey = useMemo(() => `data-table-state-${props.dataSource}`, [props.dataSource]);

    const [error, setError] = useState<Error | null>(null);

    // This will trigger error boundary
    if (error) {
        throw error;
    }

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState<DataSourceType[T]['entry'][]>([]);
    const [totalRecords, setTotalRecords] = useState(0);

    const getInitialLazyState = (): LazyStateType<DataSourceType[T]['filter']> => {
        const savedState = readFromLocalStorage<LazyStateType<DataSourceType[T]['filter']>>(tableStateKey);

        return {
            ...(DataSourceConfig[props.dataSource]['defaultParams'] as LazyStateType<DataSourceType[T]['filter']>),
            ...(savedState || {})
        };
    };

    const [lazyState, setLazyState] = useState<LazyStateType<DataSourceType[T]['filter']>>(getInitialLazyState);

    const [selectedEntry, setSelectedEntry] = useState<DataSourceType[T]['entry'][]>([]);

    const prevSelectedEntryRef = useRef<DataSourceType[T]['entry'][] | null>(null);

    const clearSelectedEntry = useCallback(() => {
        setSelectedEntry([]);
        props.onSelectionChange?.([]); // Notify parent of selection changes
        prevSelectedEntryRef.current = null;
    }, []);

    useEffect(() => {
        const savedState = readFromLocalStorage<LazyStateType<DataSourceType[T]['filter']>>(tableStateKey);
        const filtersChanged = !isEqual(savedState?.filters, props.filters);

        if (filtersChanged) {
            clearSelectedEntry();
        }

        setLazyState((prev) => ({
            ...prev,
            first: filtersChanged ? 0 : savedState?.first ?? prev.first,
            filters: {...props.filters},
        }));
    }, [clearSelectedEntry, props.filters, tableStateKey]);

    useEffect(() => {
        const abortController = new AbortController();

        (async () => {
            try {
                setLoading(true);

                const mapFiltersToApiPayload = (filters: DataSourceType[T]['filter']): DataTableFindParamsFilterType => {
                    return Object.entries(filters).reduce((acc, [key, filterObj]) => {
                        if (filterObj?.value != null && filterObj.value !== '') {
                            acc[key === 'global' ? 'term' : key] = filterObj.value;
                        }
                        return acc;
                    }, {} as DataTableFindParamsFilterType);
                };

                const loadLazyData = async (dataSource: T, signal?: AbortSignal) => {
                    if (signal?.aborted) {
                        return;
                    } // Don't proceed if already aborted

                    const findFunction = DataSourceConfig[dataSource]['findFunction'];

                    if (!findFunction) {
                        throw new Error(`No fetch function found for ${dataSource}`);
                    }

                    const data = await findFunction({
                        order_by: lazyState.sortField,
                        direction: lazyState.sortOrder === 1 ? 'ASC' : 'DESC',
                        limit: lazyState.rows,
                        page: lazyState.rows > 0 ? Math.floor(lazyState.first / lazyState.rows) + 1 : 1,
                        filter: mapFiltersToApiPayload(lazyState.filters),
                    });

                    if (signal?.aborted) {
                        return;
                    } // Don't proceed if already aborted

                    if (!data) {
                        throw new Error(`Could not retrieve ${dataSource} data`);
                    }

                    return data;
                };

                const response = await loadLazyData(props.dataSource, abortController.signal);

                if (response && !abortController.signal.aborted) {
                    setData(response.entries);
                    setTotalRecords(response.pagination.total);
                }
            } catch (error) {
                if (!abortController.signal.aborted) {
                    setError(error instanceof Error ? error : new Error(String(error)));
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            abortController.abort();
        };
    }, [lazyState, props.dataSource]);

    const onPage = useCallback((event: DataTablePageEvent) => {
        clearSelectedEntry();

        setLazyState(prev => ({
            ...prev,
            first: event.first,
            rows: event.rows,
        }));
    }, [clearSelectedEntry]);

    const onSort = useCallback((event: DataTableSortEvent) => {
        clearSelectedEntry();

        setLazyState(prev => ({
            ...prev,
            first: 0,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
        }));
    }, [clearSelectedEntry]);

    const onSelectionChange = useCallback((event: SelectionChangeEvent<DataSourceType[T]['entry']>) => {
        setSelectedEntry(event.value);

        if (props.onSelectionChange) {
            props.onSelectionChange(event.value); // Notify parent of selection changes
        }
    }, [props.onSelectionChange]);

    useDebouncedEffect(() => {
        const prevSelected = prevSelectedEntryRef.current;
        const selected = selectedEntry;

        if (selected.length === 1 && props.onRowSelect) {
            props.onRowSelect(selected[0]);
        }

        if (selected.length === 0 && prevSelected && prevSelected.length === 1 && props.onRowUnselect) {
            props.onRowUnselect(prevSelected[0]);
        }

        prevSelectedEntryRef.current = selected;
    }, [selectedEntry], 1000);

    const tableColumns = useMemo(() => (
        props.columns.map((column: DataTableColumnType<DataSourceType[T]['entry']>) => (
            <Column
                key={column.field}
                field={column.field}
                header={column.header}
                style={column.style}
                body={(rowData) => column.body?.({...rowData}, column) || rowData[column.field]}
                sortable={column.sortable ?? false}
            />
        ))
    ), [props.columns]);

    const paginatorTemplate = useMemo(() => ({
        layout: 'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
        CurrentPageReport: (options: PaginatorCurrentPageReportOptions) => (
            <div className="absolute left-0 hidden md:block text-sm">
                Showing {options.first} to {options.last} of {options.totalRecords} entries
            </div>
        )
    }), []);

    return (
        <DataTable
            value={data} lazy
            dataKey={props.dataKey} selectionMode={props.selectionMode} selection={selectedEntry}
            metaKeySelection={false}
            selectionPageOnly={true} onSelectionChange={onSelectionChange}
            first={lazyState.first} rows={lazyState.rows} totalRecords={totalRecords}
            onPage={onPage} onSort={onSort} sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
            loading={loading}
            stripedRows
            scrollable scrollHeight={props.scrollHeight || 'flex'}
            resizableColumns reorderableColumns
            stateStorage="local" stateKey={tableStateKey}
            filters={lazyState.filters}
            paginator rowsPerPageOptions={[5, 10, 25, 50]}
            paginatorTemplate={paginatorTemplate}
            paginatorClassName="relative"
        >
            {props.selectionMode === 'multiple' && (
                <Column selectionMode="multiple" headerStyle={{width: '1rem'}}/>
            )}

            {tableColumns}
        </DataTable>
    );
}