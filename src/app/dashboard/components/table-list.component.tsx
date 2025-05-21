'use client'

import {JSX, useEffect, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {FetchFilterUserType, UserEntryType, fetchUsers} from '@/lib/services/user.service';

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
    filters: Record<string, any>;
};

type TableColumn = {
    field: string;
    header: string;
    sortable?: boolean;
    // filterable?: boolean;
    body?: (rowData: any) => JSX.Element;
};

export type TableColumnsType = TableColumn[];

type TablePropsType<T extends keyof ServiceDataTypes> = {
    dataSource: T;
    columns: TableColumnsType;
}

export default function DataTableList<T extends keyof ServiceDataTypes>(props: TablePropsType<T>) {
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);
    // const [data, setData] = useState<ServiceDataTypes[T]['entry'][]>([]);
    const [data, setData] = useState<ServiceDataTypes[T]['entry'][]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyState, setLazyState] = useState<LazyStateType>({
        first: 0,
        rows: 10,
        sortField: 'id',
        sortOrder: -1,
        filters: {}
    });

    // const [selectAll, setSelectAll] = useState(false);
    // const [selectedData, setSelectedData] = useState(null);

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

    // Render error UI if error exists
    if (error) {
        throw error; // This will trigger your error boundary
    }

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
        setLazyState(event);
    };

    const onSort = (event: LazyStateType) => {
        event['first'] = 0; // Reset to page 1

        setLazyState(event);
    };

    const onFilter = (event: LazyStateType) => {
        event['first'] = 0; // Reset to page 1

        setLazyState(event);
    };

    const footer = `In total there are ${totalRecords} entries.`;

    return (
        <div className="rounded-2xl p-4 bg-base-100">
            <DataTable
                value={data}
                dataKey="id"
                lazy
                paginator
                first={lazyState.first} rows={lazyState.rows} totalRecords={totalRecords} onPage={onPage}
                onSort={onSort} sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
                onFilter={onFilter} filters={lazyState.filters}
                loading={loading}
                stripedRows
                scrollable scrollHeight="flex"
                resizableColumns
                stateStorage="local" stateKey={`data-table-state-${props.dataSource}`}
                footer={footer}
            >
                {props.columns.map((column: TableColumn) => (
                    <Column key={column.field} field={column.field} header={column.header} body={column.body ?? null} sortable={column.sortable ?? false} />
                ))}
            </DataTable>
        </div>
    );
}