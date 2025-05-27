'use client';

import React, {useEffect, useRef, useState} from 'react';
import {DataTable, DataTableStateEvent} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {UserEntryType, fetchUsers, UserTableFiltersType, UserTableFilters} from '@/lib/services/user.service';
import {StatusKey, TableRowDate, TableRowStatus} from '@/app/dashboard/components/table-row.component';
import {useDebouncedEffect} from '@/app/hooks';

// Configuration
type ServiceDataTypes = {
    users: {
        filter: UserTableFiltersType;
        entry: UserEntryType;
    };
};

const serviceMap: {
    [K in keyof ServiceDataTypes]: {
        fetchFunction: TableFetchFunction<ServiceDataTypes[K]['entry']>;
        defaultFilters: ServiceDataTypes[K]['filter'];
    }
} = {
    users: {
        fetchFunction: fetchUsers,
        defaultFilters: UserTableFilters
    },
};

// Types
export type TableFetchParamsType = {
    order_by: string;
    direction: 'ASC' | 'DESC';
    limit: number;
    page: number;
    filter: Record<string, any>;
};

export type TableFetchResponseType<TEntry = Record<string, any>> = {
    entries: TEntry[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
};

export type TableFetchFunction<TEntry = Record<string, any>> = (
    params: TableFetchParamsType
) => Promise<TableFetchResponseType<TEntry>>;

type LazyStateType<TFilter> = {
    first: number;
    rows: number;
    sortField: string;
    sortOrder: 1 | 0 | -1 | null | undefined;
    filters: TFilter;
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

export type TableFilterBodyTemplateProps<TFilter> = {
    filters: TFilter;
    setFilterAction: (filters: TFilter) => void;
};

type TablePropsType<T extends keyof ServiceDataTypes> = {
    dataSource: T;
    columns: TableColumnsType;
    filterBody?: (props: TableFilterBodyTemplateProps<ServiceDataTypes[T]['filter']>) => React.JSX.Element;
    selectionMode: 'checkbox' | 'multiple' | null;
    onRowSelect?: (data: ServiceDataTypes[T]['entry']) => void;
    onRowUnselect?: (data: ServiceDataTypes[T]['entry']) => void;
}

export default function DataTableList<T extends keyof ServiceDataTypes>(props: TablePropsType<T>) {
    const service = serviceMap[props.dataSource];

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ServiceDataTypes[T]['entry'][]>([]);
    // const [filters, setFilters] = useState<LazyStateType<any>>(service.defaultFilters);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyState, setLazyState] = useState<LazyStateType<ServiceDataTypes[T]['filter']>>({
        first: 0,
        rows: 10,
        sortField: 'id',
        sortOrder: -1,
        filters: service.defaultFilters
    }); // TODO move this to user.service similar to defaultFilter -> defaultParams

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
        const fetchFunction = service.fetchFunction;
        const fetchParams: TableFetchParamsType = {
            order_by: lazyState.sortField,
            direction: lazyState.sortOrder === 1 ? 'ASC' : 'DESC',
            limit: lazyState.rows,
            page: Math.floor(lazyState.first / lazyState.rows) + 1,
            filter: {} //lazyState.filters
        };

        return await fetchFunction(fetchParams);
    };

    const onPage = (event: DataTableStateEvent) => {
        clearSelection();
        setLazyState((prev) => ({
            ...prev,
            first: event.first,
            rows: event.rows
        }));
    };

    const onSort = (event: DataTableStateEvent) => {
        clearSelection();
        setLazyState((prev) => ({
            ...prev,
            first: 0,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
        }));
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

    const header = hydrated && props.filterBody?.({
        filters: lazyState.filters as ServiceDataTypes[T]['filter'],
        setFilterAction: (newFilters: ServiceDataTypes[T]['filter']) => {
            console.log('setFilterAction')
            // clearSelection();

            setLazyState((prev: LazyStateType<ServiceDataTypes[T]['filter']>) => ({
                ...prev,
                first: 0,
                filters: newFilters,
            }));
        },
    });
    const footer = `In total there are ${totalRecords} entries.`;

    return (
        <div className="rounded-2xl p-4 bg-base-100">
            <DataTable
                value={data} lazy

                dataKey="id" selectionMode={props.selectionMode} selection={selectedEntry} metaKeySelection={false}
                selectionPageOnly={true}
                onSelectionChange={onSelectionChange}
                paginator rowsPerPageOptions={[5, 10, 25, 50]}
                first={lazyState.first} rows={lazyState.rows} totalRecords={totalRecords} onPage={onPage}
                onSort={onSort} sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
                loading={loading}
                stripedRows
                scrollable scrollHeight="flex"
                resizableColumns reorderableColumns
                stateStorage="local" stateKey={`data-table-state-${props.dataSource}`}
                filters={lazyState.filters} header={header} footer={footer}
            >
                {props.selectionMode === 'multiple' && (
                    <Column selectionMode="multiple" headerStyle={{width: '1rem'}}/>
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

    return <TableRowDate date={date}/>;
};