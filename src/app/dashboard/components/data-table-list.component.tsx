'use client';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {DataTable, DataTablePageEvent, DataTableSortEvent} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {StatusKey, TableRowDate, TableRowStatus} from '@/app/dashboard/components/data-table-row.component';
import {useDebouncedEffect} from '@/app/hooks';
import {SERVICES, ServicesTypes} from '@/app/dashboard/config';
import {
    LazyStateType,
    DataTableColumnType,
    DataTableFindParamsType, DataTablePropsType
} from '@/app/dashboard/types/data-table.type';
import {readFromLocalStorage} from '@/lib/utils/storage';
import isEqual from 'fast-deep-equal';
import {capitalizeFirstLetter} from '@/lib/utils/string';
import {PaginatorCurrentPageReportOptions} from 'primereact/paginator';

type SelectionChangeEvent<T> = {
    originalEvent: React.SyntheticEvent;
    value: T[];
};

export default function DataTableList<T extends keyof ServicesTypes>(props: DataTablePropsType<T>) {
    const tableStateKey = useMemo(() => `data-table-state-${props.dataSource}`, [props.dataSource]);

    const [error, setError] = useState<Error | null>(null);

    // Render error UI if error exists
    if (error) {
        throw error; // This will trigger error boundary
    }

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState<ServicesTypes[T]['entry'][]>([]);
    const [totalRecords, setTotalRecords] = useState(0);

    const getInitialLazyState = (): LazyStateType<ServicesTypes[T]['filter']> => {
        const savedState = readFromLocalStorage<LazyStateType<ServicesTypes[T]['filter']>>(tableStateKey);

        return {
            ...(SERVICES[props.dataSource]['defaultParams'] as LazyStateType<ServicesTypes[T]['filter']>),
            ...(savedState || {})
        };
    };

    const [lazyState, setLazyState] = useState<LazyStateType<ServicesTypes[T]['filter']>>(getInitialLazyState);

    const [selectedEntry, setSelectedEntry] = useState<ServicesTypes[T]['entry'][]>([]);

    const prevSelectedEntryRef = useRef<ServicesTypes[T]['entry'][] | null>(null);

    const clearSelectedEntry = () => {
        setSelectedEntry([]);
        props.onSelectionChange?.([]); // Notify parent of selection changes
        prevSelectedEntryRef.current = null;
    };

    useEffect(() => {
        const savedState = readFromLocalStorage<LazyStateType<ServicesTypes[T]['filter']>>(tableStateKey);
        const filtersChanged = !isEqual(savedState?.filters, props.filters);

        if (filtersChanged) {
            clearSelectedEntry();
        }

        setLazyState((prev) => ({
            ...prev,
            first: filtersChanged ? 0 : savedState?.first ?? prev.first,
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
        const findFunction = SERVICES[props.dataSource]['findFunction'];

        if (!findFunction) {
            throw new Error(`No fetch function found for ${props.dataSource}`);
        }

        const mapFiltersToApiPayload = (filters: ServicesTypes[T]['filter']): Record<string, any> => {
            return Object.entries(filters).reduce((acc, [key, filterObj]) => {
                if (filterObj?.value != null && filterObj.value !== '') {
                    acc[key === 'global' ? 'term' : key] = filterObj.value;
                }
                return acc;
            }, {} as Record<string, any>);
        };

        const params: DataTableFindParamsType = {
            order_by: lazyState.sortField,
            direction: lazyState.sortOrder === 1 ? 'ASC' : 'DESC',
            limit: lazyState.rows,
            page: lazyState.rows > 0 ? Math.floor(lazyState.first / lazyState.rows) + 1 : 1,
            filter: mapFiltersToApiPayload(lazyState.filters),
        };

        return await findFunction(params);
    };

    const onPage = useCallback((event: DataTablePageEvent) => {
        clearSelectedEntry();

        setLazyState(prev => ({
            ...prev,
            first: event.first,
            rows: event.rows,
        }));
    }, []);

    const onSort = useCallback((event: DataTableSortEvent) => {
        clearSelectedEntry();

        setLazyState(prev => ({
            ...prev,
            first: 0,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
        }));
    }, []);

    const onSelectionChange = useCallback((event: SelectionChangeEvent<ServicesTypes[T]['entry']>) => {
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
        props.columns.map((column: DataTableColumnType) => (
            <Column
                key={column.field}
                field={column.field}
                header={column.header}
                style={column.style}
                body={(rowData) => column.body?.(rowData, column) || rowData[column.field]}
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

export const StatusBodyTemplate = (entry: { status: StatusKey, deleted_at?: string }) => {
    const status = entry.deleted_at ? 'deleted' : entry.status;

    return <TableRowStatus status={status}/>;
};

export const DateBodyTemplate = (entry: Record<string, any>, column: DataTableColumnType) => {
    const date: Date | string = entry[column.field];

    return <TableRowDate date={date}/>;
};

export const CapitalizeBodyTemplate = (entry: Record<string, any>, column: DataTableColumnType) => {
    return capitalizeFirstLetter(entry[column.field]);
};