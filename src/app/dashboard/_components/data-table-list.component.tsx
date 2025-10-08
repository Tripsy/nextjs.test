'use client';

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {DataTable, DataTablePageEvent, DataTableSortEvent} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {DataSourceType, getDataSourceConfig} from '@/config/data-source';
import {
    LazyStateType,
    DataTableColumnType,
    DataTablePropsType
} from '@/types/data-table.type';
import {PaginatorCurrentPageReportOptions} from 'primereact/paginator';
import {useDataTable} from '@/providers/dashboard/data-table-provider';

type SelectionChangeEvent<T> = {
    originalEvent: React.SyntheticEvent;
    value: T[];
};

export default function DataTableList<T extends keyof DataSourceType>(props: DataTablePropsType<T>) {
    const {
        dataSource,
        dataStorageKey,
        selectionMode,
        initState,
        selectedEntries,
        setSelectedEntries,
        clearSelectedEntries,
        filters
    } = useDataTable<T>();

    const [error, setError] = useState<Error | null>(null);

    // This will trigger error boundary
    if (error) {
        throw error;
    }

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState<DataSourceType[T]['entry'][]>([]);
    const [totalRecords, setTotalRecords] = useState(0);

    const [lazyState, setLazyState] = useState<LazyStateType<DataSourceType[T]['filter']>>(initState);

    useEffect(() => {
        clearSelectedEntries();

        setLazyState((prev) => ({
            ...prev,
            first: 0,
            filters: {...filters},
        }));
    }, [clearSelectedEntries, filters, dataStorageKey]);

    const findFunctionFilter = useMemo(() => {
        const params = Object.entries(lazyState.filters).reduce((acc, [key, filterObj]) => {
            if (filterObj?.value != null && filterObj.value !== '') {
                acc[key === 'global' ? 'term' : String(key)] = filterObj.value;
            }
            return acc;
        }, {} as Record<string, string>);

        return JSON.stringify(params);
    }, [lazyState.filters]);

    useEffect(() => {
        console.log('lazyState changed');
        const abortController = new AbortController();

        (async () => {
            try {
                setLoading(true);

                const loadLazyData = async (signal?: AbortSignal) => {
                    if (signal?.aborted) {
                        return;
                    } // Don't proceed if already aborted

                    const findFunction = getDataSourceConfig(dataSource, 'findFunction');

                    if (!findFunction) {
                        throw new Error(`No fetch function found for ${dataSource}`);
                    }

                    const data = await findFunction({
                        order_by: lazyState.sortField,
                        direction: lazyState.sortOrder === 1 ? 'ASC' : 'DESC',
                        limit: lazyState.rows,
                        page: lazyState.rows > 0 ? Math.floor(lazyState.first / lazyState.rows) + 1 : 1,
                        filter: findFunctionFilter,
                    });

                    if (signal?.aborted) {
                        return;
                    } // Don't proceed if already aborted

                    if (!data) {
                        throw new Error(`Could not retrieve ${dataSource} data`);
                    }

                    return data;
                };

                const response = await loadLazyData(abortController.signal);

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
    }, [dataSource, lazyState.sortField, lazyState.sortOrder, lazyState.rows, lazyState.first, findFunctionFilter]);

    const onPage = useCallback((event: DataTablePageEvent) => {
        clearSelectedEntries();

        setLazyState(prev => ({
            ...prev,
            first: event.first,
            rows: event.rows,
        }));
    }, [clearSelectedEntries]);

    const onSort = useCallback((event: DataTableSortEvent) => {
        clearSelectedEntries();

        setLazyState(prev => ({
            ...prev,
            first: 0,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
        }));
    }, [clearSelectedEntries]);

    const onSelectionChange = useCallback((event: SelectionChangeEvent<DataSourceType[T]['entry']>) => {
        setSelectedEntries(event.value);
    }, [setSelectedEntries]);

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
            <div className="data-table-paginator-showing">
                Showing {options.first} to {options.last} of {options.totalRecords} entries
            </div>
        )
    }), []);

    return (
        <DataTable
            value={data} lazy
            dataKey={props.dataKey} selectionMode={selectionMode} selection={selectedEntries}
            metaKeySelection={false}
            selectionPageOnly={true} onSelectionChange={onSelectionChange}
            first={lazyState.first} rows={lazyState.rows} totalRecords={totalRecords}
            onPage={onPage} onSort={onSort} sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
            loading={loading}
            stripedRows
            scrollable scrollHeight={props.scrollHeight || 'flex'}
            resizableColumns reorderableColumns
            stateStorage="local" stateKey={dataStorageKey}
            filters={lazyState.filters}
            paginator rowsPerPageOptions={[5, 10, 25, 50]}
            paginatorTemplate={paginatorTemplate}
            paginatorClassName="data-table-paginator"
        >
            {selectionMode === 'multiple' && (
                <Column selectionMode="multiple" headerStyle={{width: '1rem'}}/>
            )}

            {tableColumns}
        </DataTable>
    );
}