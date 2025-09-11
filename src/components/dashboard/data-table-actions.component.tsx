'use client';

import React from 'react';
import {Icons} from '@/components/icon.component';
import {useDataTable} from '@/providers/dashboard/data-table-provider';
import {DataTableSelectionModeType} from '@/types/data-table.type';
import {useDataTableFilters} from '@/hooks';
import {createFilterHandlers, filtersReducer} from '@/reducers/dashboard/data-table-filters.reducer';

// TODO when single entry is selected show edit / activate / deactivate & restore

export function DataTableActions() {
    const {selectionMode, selectedEntries} = useDataTable();

    const {defaultFilters, dispatchFilters} = useDataTableFilters<'users'>(filtersReducer);

    const {
        handleReset
    } = createFilterHandlers(dispatchFilters);

    const isMultipleSelectionMode = (selectionMode: DataTableSelectionModeType) =>
        selectionMode === 'multiple';

    return (
        <div className="my-6 pt-4 border-t border-line flex justify-between">
            <div className="flex items-center gap-4">
                {isMultipleSelectionMode(selectionMode) && (
                    <div>
                        {selectedEntries.length} selected
                    </div>
                )}

                {selectedEntries.length > 0 && (
                    <button className="btn btn-md btn-delete">
                        <Icons.Action.Delete className="w-4 h-4"/>
                        Delete
                    </button>
                )}
            </div>
            <div className="flex gap-4">
                <button
                    className="btn btn-warning rounded"
                    onClick={() => handleReset(defaultFilters)}
                    title="Reset filters"
                >
                    <Icons.Action.Reset className="w-4 h-4"/>
                    Reset
                </button>
                <button
                    className="btn btn-info rounded"
                    title="Add new entry"
                >
                    <Icons.Action.Add className="w-4 h-4"/>
                    Add
                </button>
            </div>
        </div>
    );
}