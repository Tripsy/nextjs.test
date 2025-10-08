'use client';

import React from 'react';
import {Icons} from '@/components/icon.component';
import {useDataTable} from '@/providers/dashboard/data-table-provider';
import {DataTableSelectionModeType} from '@/types/data-table.type';
import {useDataTableFilters} from '@/hooks';
import {createFilterHandlers, filtersReducer} from '@/reducers/dashboard/data-table-filters.reducer';
import {DataSourceType} from '@/config/data-source';
import {useUserStore} from '@/app/dashboard/users/users.action';

export function DataTableActions<K extends keyof DataSourceType>() {
    const {selectionMode, defaultState, selectedEntries} = useDataTable();
    const {dispatchFilters} = useDataTableFilters<K>(filtersReducer);
    // const { openAdd, openEdit, openDelete } = useUserStore();
    const { openAdd } = useUserStore();

    const {
        handleReset
    } = createFilterHandlers(dispatchFilters);

    const isMultipleSelectionMode = (selectionMode: DataTableSelectionModeType) =>
        selectionMode === 'multiple';

    // const handleEdit = () => {
    //     if (selectedEntries.length === 1) {
    //         openEdit(selectedEntries[0]);
    //     }
    // };
    //
    // const handleDelete = () => {
    //     if (selectedEntries.length > 0) {
    //         openDelete(selectedEntries);
    //     }
    // };

    return (
        <div className="my-6 pt-4 border-t border-line flex justify-between">
            <div className="flex items-center gap-4">
                {isMultipleSelectionMode(selectionMode) && (
                    <div>
                        {selectedEntries.length} selected
                    </div>
                )}

                {/*TODO: the buttons need to be somewhat configurable */}
                {/*TODO: other actions: edit / activate / deactivate & restore*/}
                {/*TODO: for single selection present actions at mouse position (ex: statamic)*/}
                {selectedEntries.length > 0 && (
                    <button className="btn btn-delete rounded">
                        <Icons.Action.Delete className="w-4 h-4"/>
                        Delete
                    </button>
                )}
            </div>
            <div className="flex gap-4">
                <button
                    className="btn btn-warning rounded"
                    onClick={() => handleReset(defaultState.filters)}
                    title="Reset filters"
                >
                    <Icons.Action.Reset className="w-4 h-4"/>
                    Reset
                </button>
                {/*TODO: not all the components have add button */}
                <button
                    className="btn btn-info rounded"
                    title="Add new entry"
                    onClick={openAdd}
                >
                    <Icons.Action.Add className="w-4 h-4"/>
                    Add
                </button>
            </div>
        </div>
    );
}