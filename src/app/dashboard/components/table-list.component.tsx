'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DataTable, DataTablePageEvent, DataTableSortEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { StatusKey, TableRowDate, TableRowStatus } from '@/app/dashboard/components/table-row.component';
import { useDebouncedEffect } from '@/app/hooks';
import { SERVICES, ServicesTypes } from '@/app/dashboard/config';
import {
    TableColumn,
    TableColumnsType,
    TableFetchParamsType
} from '@/app/dashboard/types/table-list.type';

export type LazyStateType<TFilter> = {
    first: number;
    rows: number;
    sortField: string;
    sortOrder: 1 | 0 | -1 | null | undefined;
    filters: TFilter;
};

type TablePropsType<T extends keyof ServicesTypes> = {
    dataSource: T;
    columns: TableColumnsType;
    filters: ServicesTypes[T]['filter'];
    selectionMode: 'checkbox' | 'multiple' | null;
    onRowSelect?: (data: ServicesTypes[T]['entry']) => void;
    onRowUnselect?: (data: ServicesTypes[T]['entry']) => void;
};

type SelectionChangeEvent<T> = {
    originalEvent: React.SyntheticEvent;
    value: T[];
};

export default function DataTableList<T extends keyof ServicesTypes>(props: TablePropsType<T>) {
    const [error, setError] = useState<Error | null>(null);

    // Render error UI if error exists
    if (error) {
        throw error; // This will trigger error boundary
    }

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState<ServicesTypes[T]['entry'][]>([]);
    const [totalRecords, setTotalRecords] = useState(0);

    const getInitialLazyState = (): LazyStateType<ServicesTypes[T]['filter']> => {
        const storedState = localStorage.getItem(`data-table-state-${props.dataSource}`);
        const parsed = storedState ? JSON.parse(storedState) : null;

        return {
            ...(SERVICES[props.dataSource]['defaultParams'] as LazyStateType<ServicesTypes[T]['filter']>),
            ...(parsed || {}),
            filters: props.filters
        };
    };

    const [lazyState, setLazyState] = useState<LazyStateType<ServicesTypes[T]['filter']>>(getInitialLazyState);

    const [selectedEntry, setSelectedEntry] = useState<ServicesTypes[T]['entry'][]>([]);

    const prevSelectedEntryRef = useRef<ServicesTypes[T]['entry'][] | null>(null);

    const clearSelectedEntry = () => {
        setSelectedEntry([]);
        prevSelectedEntryRef.current = null;
    };

    useEffect(() => {
        clearSelectedEntry();

        setLazyState((prev) => ({
            ...prev,
            first: 0, // TODO: this is causing the page selection to be persistent
            filters: props.filters,
        }));
    }, [props.filters]);

    useEffect(() => {
        const abortController = new AbortController();

        setLoading(true);

        loadLazyData()
            .then(response => {
                if (!abortController.signal.aborted) {
                    setData(response.entries);
                    setTotalRecords(response.pagination.total);
                }
            })
            .catch((err) => {
                if (!abortController.signal.aborted) {
                    setError(err);
                }
            })
            .finally(() => {
                if (!abortController.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => {
            abortController.abort();
        };
    }, [lazyState]);

    const loadLazyData = async () => {
        const fetchFunction = SERVICES[props.dataSource]['fetchFunction'];

        const mapFiltersToApiPayload = (filters: ServicesTypes[T]['filter']): Record<string, any> => {
            const payload: Record<string, any> = {};

            Object.entries(filters).forEach(([key, filterObj]) => {
                if (filterObj?.value != null && filterObj.value !== '') {
                    if (key === 'global') key = 'term';
                    payload[key] = filterObj.value;
                }
            });

            return payload;
        };

        const fetchParams: TableFetchParamsType = {
            order_by: lazyState.sortField,
            direction: lazyState.sortOrder === 1 ? 'ASC' : 'DESC',
            limit: lazyState.rows,
            page: Math.floor(lazyState.first / lazyState.rows) + 1,
            filter: mapFiltersToApiPayload(lazyState.filters),
        };

        return await fetchFunction(fetchParams);
    };

    const onPage = (event: DataTablePageEvent) => {
        clearSelectedEntry();

        setLazyState((prev) => ({
            ...prev,
            first: event.first,
            rows: event.rows,
        }));
    };

    const onSort = (event: DataTableSortEvent) => {
        clearSelectedEntry();

        setLazyState((prev) => ({
            ...prev,
            first: 0,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
        }));
    };

    const onSelectionChange = (event: SelectionChangeEvent<ServicesTypes[T]['entry']>) => {
        setSelectedEntry(event.value);
    };

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

    const footer = `In total there are ${totalRecords} entries.`;

    return (
        <DataTable
            value={data} lazy
            dataKey="id" selectionMode={props.selectionMode} selection={selectedEntry} metaKeySelection={false}
            selectionPageOnly={true} onSelectionChange={onSelectionChange}
            paginator rowsPerPageOptions={[5, 10, 25, 50]}
            first={lazyState.first} rows={lazyState.rows} totalRecords={totalRecords}
            onPage={onPage} onSort={onSort} sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
            loading={loading}
            stripedRows
            scrollable scrollHeight="flex"
            resizableColumns reorderableColumns
            stateStorage="local" stateKey={`data-table-state-${props.dataSource}`}
            filters={props.filters}
            footer={footer}
        >
            {props.selectionMode === 'multiple' && (
                <Column selectionMode="multiple" headerStyle={{ width: '1rem' }} />
            )}

            {props.columns.map((column: TableColumn) => (
                <Column
                    key={column.field}
                    field={column.field}
                    header={column.header}
                    style={column.style}
                    body={(rowData) => column.body?.(rowData, column) || rowData[column.field]}
                    sortable={column.sortable ?? false}
                />
            ))}
        </DataTable>
    );
}

export const StatusBodyTemplate = (entry: { status: StatusKey }) => {
    return <TableRowStatus status={entry.status} />;
};

export const DateBodyTemplate = (entry: Record<string, any>, column: TableColumn) => {
    const date: Date | string = entry[column.field];
    return <TableRowDate date={date} />;
};
