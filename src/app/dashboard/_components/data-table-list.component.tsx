'use client';

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {DataTable, DataTablePageEvent, DataTableSortEvent} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {
    DataSourceType,
    getDataSourceConfig,
    DataTablePropsType
} from '@/config/data-source';
import {PaginatorCurrentPageReportOptions} from 'primereact/paginator';
import {useDataTable} from '@/app/dashboard/_providers/data-table-provider';
import {useStore} from 'zustand/react';

type SelectionChangeEvent<T> = {
    originalEvent: React.SyntheticEvent;
    value: T[];
};

export default function DataTableList<T extends keyof DataSourceType>(props: DataTablePropsType) {
    const {
        dataSource,
        dataStorageKey,
        selectionMode,
        modelStore
    } = useDataTable();

    const [error, setError] = useState<Error | null>(null);

    const tableState = useStore(modelStore, (state) => state.tableState);
    const updateTableState = useStore(modelStore, (state) => state.updateTableState);
    const selectedEntries = useStore(modelStore, (state) => state.selectedEntries);
    const setSelectedEntries = useStore(modelStore, (state) => state.setSelectedEntries);
    const clearSelectedEntries = useStore(modelStore, (state) => state.clearSelectedEntries);
    const isLoading = useStore(modelStore, (state) => state.isLoading);
    const setLoading = useStore(modelStore, (state) => state.setLoading);

    const [data, setData] = useState<DataSourceType[T]['model'][]>([]);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        clearSelectedEntries();

        updateTableState({
            first: 0
        });
    }, [clearSelectedEntries, updateTableState, tableState.filters]);

    const findFunctionFilter = useMemo(() => {
        const params = Object.entries(tableState.filters).reduce((acc, [key, filterObj]) => {
            if (filterObj?.value != null && filterObj.value !== '') {
                acc[key === 'global' ? 'term' : String(key)] = filterObj.value;
            }
            return acc;
        }, {} as Record<string, string>);

        return JSON.stringify(params);
    }, [tableState.filters]);

    useEffect(() => {
        console.log('tableState changed');
        const abortController = new AbortController();

        (async () => {
            try {
                setLoading(true);

                const loadLazyData = async (signal?: AbortSignal) => {
                    if (signal?.aborted) {
                        return;
                    } // Don't proceed if already aborted

                    const functions = getDataSourceConfig(dataSource, 'functions');
                    const findFunction = functions?.find;

                    if (!findFunction) {
                        throw new Error(`No fetch function found for ${dataSource}`);
                    }

                    const data = await findFunction({
                        order_by: tableState.sortField,
                        direction: tableState.sortOrder === 1 ? 'ASC' : 'DESC',
                        limit: tableState.rows,
                        page: tableState.rows > 0 ? Math.floor(tableState.first / tableState.rows) + 1 : 1,
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
    }, [
        dataSource,
        tableState.sortField,
        tableState.sortOrder,
        tableState.rows,
        tableState.first,
        findFunctionFilter,
        setLoading,
        tableState.reloadTrigger
    ]);

    const onPage = useCallback((event: DataTablePageEvent) => {
        clearSelectedEntries();

        updateTableState({
            first: event.first,
            rows: event.rows,
        });
    }, [clearSelectedEntries, updateTableState]);

    const onSort = useCallback((event: DataTableSortEvent) => {
        clearSelectedEntries();

        updateTableState({
            first: 0,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
        });
    }, [clearSelectedEntries, updateTableState]);

    const onSelectionChange = useCallback((event: SelectionChangeEvent<DataSourceType[T]['model']>) => {
        setSelectedEntries(event.value);
    }, [setSelectedEntries]);

    const columns = getDataSourceConfig(dataSource, 'dataTableColumns');

    const tableColumns = useMemo(
        () =>
            columns.map((column) => (
                <Column
                    key={column.field}
                    field={column.field}
                    header={column.header}
                    style={column.style}
                    sortable={column.sortable ?? false}
                    body={(rowData) =>
                        column.body ? column.body(rowData, column) : rowData[column.field]
                    }
                />
            )),
        [columns]
    );

    const paginatorTemplate = useMemo(() => ({
        layout: 'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
        CurrentPageReport: (options: PaginatorCurrentPageReportOptions) => (
            <div className="data-table-paginator-showing">
                Showing {options.first} to {options.last} of {options.totalRecords} entries
            </div>
        )
    }), []);

    // This will trigger error boundary
    if (error) {
        throw error;
    }

    return (
        <DataTable
            value={data} lazy
            dataKey={props.dataKey} selectionMode={selectionMode} selection={selectedEntries}
            metaKeySelection={false}
            selectionPageOnly={true} onSelectionChange={onSelectionChange}
            first={tableState.first} rows={tableState.rows} totalRecords={totalRecords}
            onPage={onPage} onSort={onSort} sortField={tableState.sortField} sortOrder={tableState.sortOrder}
            loading={isLoading}
            stripedRows
            scrollable scrollHeight={props.scrollHeight || 'flex'}
            resizableColumns reorderableColumns
            stateStorage="local" stateKey={dataStorageKey}
            filters={tableState.filters}
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