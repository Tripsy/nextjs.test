'use client';

import React, {useEffect, useRef, useState} from 'react';
import {DataTable, DataTableFilterMeta} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {FetchFilterUserType, UserEntryType, fetchUsers} from '@/lib/services/user.service';
import {StatusKey, TableRowDate, TableRowStatus} from '@/app/dashboard/components/table-row.component';
import {useDebouncedEffect} from '@/app/hooks';

type ServiceDataTypes = {
    users: {
        filter: FetchFilterUserType;
        entry: UserEntryType;
    };
};

const serviceMap: {
    [K in keyof ServiceDataTypes]: TableFetchFunction<ServiceDataTypes[K]['entry'], ServiceDataTypes[K]['filter']>;
} = {
    users: fetchUsers,
};

export type TableFetchParamsType<TFilter = Record<string, any>> = {
    order_by: string;
    direction: 'ASC' | 'DESC';
    limit: number;
    page: number;
    filter: TFilter;
};

export type TableFetchResponseType<TEntry = Record<string, any>> = {
    entries: TEntry[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
};

export type TableFetchFunction<TEntry = Record<string, any>, TFilter = Record<string, any>> = (
    params: TableFetchParamsType<TFilter>
) => Promise<TableFetchResponseType<TEntry>>;

type LazyStateType = {
    first: number;
    rows: number;
    sortField: string;
    sortOrder: 1 | 0 | -1 | null | undefined;
    filters: DataTableFilterMeta;
};

type TableColumn = {
    field: string;
    header: string;
    sortable?: boolean;
    // filterable?: boolean;
    body?: (rowData: any, column: TableColumn) => React.JSX.Element | string;
    style?: React.CSSProperties;
};

export type TableColumnsType = TableColumn[];

type TablePropsType<T extends keyof ServiceDataTypes> = {
    dataSource: T;
    columns: TableColumnsType;
    filters: DataTableFilterMeta;
    selectionMode: 'checkbox' | 'multiple' | null;
    onRowSelect?: (data: ServiceDataTypes[T]['entry']) => void;
    onRowUnselect?: (data: ServiceDataTypes[T]['entry']) => void;
}

export default function DataTableList<T extends keyof ServiceDataTypes>(props: TablePropsType<T>) {
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ServiceDataTypes[T]['entry'][]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyState, setLazyState] = useState<LazyStateType>({
        first: 0,
        rows: 10,
        sortField: 'id',
        sortOrder: -1,
        filters: {}
    });

    const [selectedEntry, setSelectedEntry] = useState<ServiceDataTypes[T]['entry'][]>([])

    const [hydrated, setHydrated] = useState(false); // Stateful related flag

    // Render error UI if error exists
    if (error) {
        throw error; // This will trigger your error boundary
    }

    useEffect(() => {
        const lazyStateStored = localStorage.getItem(`table-state-${props.dataSource}`);

        if (lazyStateStored !== null && lazyStateStored !== 'undefined') {
            setLazyState(JSON.parse(lazyStateStored));
        }

        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated) {
            localStorage.setItem(`table-state-${props.dataSource}`, JSON.stringify(lazyState));
        }
    }, [lazyState, hydrated, props.dataSource]);


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
        const fetchFunction = serviceMap[props.dataSource];

        const fetchParams: TableFetchParamsType<ServiceDataTypes[T]['filter']> = {
            order_by: lazyState.sortField,
            direction: lazyState.sortOrder === 1 ? 'ASC' : 'DESC',
            limit: lazyState.rows,
            page: Math.floor(lazyState.first / lazyState.rows) + 1,
            filter: lazyState.filters as ServiceDataTypes[T]['filter']
        };

        return await fetchFunction(fetchParams);
    };

    const onPage = (event: LazyStateType) => {
        clearSelection();
        setLazyState(event);
    };

    const onSort = (event: LazyStateType) => {
        event['first'] = 0; // Reset to page 1

        clearSelection();
        setLazyState(event);
    };

    const onFilter = (event: LazyStateType) => {
        event['first'] = 0; // Reset to page 1

        clearSelection();
        setLazyState(event);
    };

    const prevSelectedEntryRef = useRef<ServiceDataTypes[T]['entry'][] | null>(null);

    type SelectionChangeEvent<T> = {
        originalEvent: React.SyntheticEvent;
        value: T[];
    };

    const onSelectionChange = (event: SelectionChangeEvent<ServiceDataTypes[T]['entry']>) => {
        setSelectedEntry(event.value);
    };

    useDebouncedEffect(() => {
        const prevSelected = prevSelectedEntryRef.current;
        const selected = selectedEntry;

        // If exactly one item is selected
        if (selected.length === 1 && props.onRowSelect) {
            props.onRowSelect(selected[0]);
        }

        // If going from 1 item to 0, call onRowUnselect
        if (selected.length === 0 && prevSelected && prevSelected.length === 1 && props.onRowUnselect) {
            props.onRowUnselect(prevSelected[0]);
        }

        // Save current selection for next comparison
        prevSelectedEntryRef.current = selected;
    }, [selectedEntry], 1000);

    const clearSelection = () => {
        setSelectedEntry([]);
        prevSelectedEntryRef.current = null;
    }

    const footer = `In total there are ${totalRecords} entries.`;

    return (
        <div className="rounded-2xl p-4 bg-base-100">
            <DataTable
                value={data} lazy
                dataKey="id" selectionMode={props.selectionMode} selection={selectedEntry} metaKeySelection={false} selectionPageOnly={true}
                onSelectionChange={onSelectionChange}
                paginator rowsPerPageOptions={[5, 10, 25, 50]}
                first={lazyState.first} rows={lazyState.rows} totalRecords={totalRecords} onPage={onPage}
                onSort={onSort} sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
                onFilter={onFilter} filters={props.filters}
                loading={loading}
                stripedRows
                scrollable scrollHeight="flex"
                resizableColumns reorderableColumns
                stateStorage="local" stateKey={`data-table-state-${props.dataSource}`}
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
                        sortable={column.sortable ?? false}/>
                ))}
            </DataTable>
        </div>
    );
}

export const StatusBodyTemplate = (entry: { status: StatusKey; }) => {
    return <TableRowStatus status={entry.status}/>;
};

export const DateBodyTemplate = (entry: Record<string, any>, column: TableColumn) => {
    const date: Date | string = entry[column.field];

    return <TableRowDate date={date} />;
};