'use client';

import React, {useEffect, useRef, useState} from 'react';
import {DataTable, DataTableStateEvent} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {StatusKey, TableRowDate, TableRowStatus} from '@/app/dashboard/components/table-row.component';
import {useDebouncedEffect} from '@/app/hooks';
import {SERVICES, ServicesTypes} from '@/app/dashboard/config';
import {
    TableColumn,
    TableColumnsType,
    TableFetchParamsType,
    TableFilterBodyTemplateProps
} from '@/app/dashboard/types/table-list.type';
import {UserTableParams} from '@/lib/services/user.service';

type LazyStateType<TFilter> = {
    first: number;
    rows: number;
    sortField: string;
    sortOrder: 1 | 0 | -1 | null | undefined;
    filters: TFilter;
};

type TablePropsType<T extends keyof ServicesTypes> = {
    dataSource: T;
    columns: TableColumnsType;
    filterBody?: (props: TableFilterBodyTemplateProps<ServicesTypes[T]['filter']>) => React.JSX.Element;
    selectionMode: 'checkbox' | 'multiple' | null;
    onRowSelect?: (data: ServicesTypes[T]['entry']) => void;
    onRowUnselect?: (data: ServicesTypes[T]['entry']) => void;
}

export default function DataTableList<T extends keyof ServicesTypes>(props: TablePropsType<T>) {
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ServicesTypes[T]['entry'][]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyState, setLazyState] = useState<LazyStateType<ServicesTypes[T]['filter']>>(UserTableParams as LazyStateType<ServicesTypes[T]['filter']>);
    const [selectedEntry, setSelectedEntry] = useState<ServicesTypes[T]['entry'][]>([]);
    const [hydrated, setHydrated] = useState(false);

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
        const fetchFunction = SERVICES[props.dataSource]['fetchFunction'];
        const fetchParams: TableFetchParamsType = {
            order_by: lazyState.sortField,
            direction: lazyState.sortOrder === 1 ? 'ASC' : 'DESC',
            limit: lazyState.rows,
            page: Math.floor(lazyState.first / lazyState.rows) + 1,
            filter: {} // TODO lazyState.filters
        };

        return await fetchFunction(fetchParams);
    };

    const onPage = (event: DataTableStateEvent) => {
        clearSelectedEntry();
        setLazyState((prev) => ({
            ...prev,
            first: event.first,
            rows: event.rows
        }));
    };

    const onSort = (event: DataTableStateEvent) => {
        clearSelectedEntry();
        setLazyState((prev) => ({
            ...prev,
            first: 0,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
        }));
    };

    // const onFilter = (event: DataTableStateEvent) => {
    //     clearSelectedEntry();
    //     setLazyState((prev) => ({
    //         ...prev,
    //         first: 0,
    //         filters: event.filters,
    //     }));
    // };

    const prevSelectedEntryRef = useRef<ServicesTypes[T]['entry'][] | null>(null);

    type SelectionChangeEvent<T> = {
        originalEvent: React.SyntheticEvent;
        value: T[];
    };

    const onSelectionChange = (event: SelectionChangeEvent<ServicesTypes[T]['entry']>) => {
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

    const clearSelectedEntry = () => {
        setSelectedEntry([]);
        prevSelectedEntryRef.current = null;
    }

    const header = hydrated && props.filterBody?.({
        filters: lazyState.filters as ServicesTypes[T]['filter'],
        setFilterAction: (newFilters: ServicesTypes[T]['filter']) => {
            clearSelectedEntry();

            setLazyState((prev: LazyStateType<ServicesTypes[T]['filter']>) => ({
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