'use client';

import React from 'react';
import {Icons} from '@/components/icon.component';
import {useDataTable} from '@/app/dashboard/_providers/data-table-provider';
import {DataSourceType, DataTableSelectionModeType} from '@/config/data-source';
import {useStore} from 'zustand/react';

export function DataTableActions<K extends keyof DataSourceType>() {
    const {selectionMode, modelStore} = useDataTable();

    const openCreate = useStore(modelStore, (state) => state.openCreate);
    const openUpdate = useStore(modelStore, (state) => state.openUpdate);
    const selectedEntries = useStore(modelStore, (state) => state.selectedEntries);

    const handleReset = () => {
        const event = new CustomEvent('filterReset', {
            detail: { source: 'DataTableActions' }
        });

        window.dispatchEvent(event);
    }

    const isMultipleSelectionMode = (selectionMode: DataTableSelectionModeType) =>
        selectionMode === 'multiple';

    const handleCreate = () => {
        openCreate();
    };

    const handleUpdate = () => {
        if (selectedEntries.length === 1) {
            openUpdate(selectedEntries[0]);
        }
    };

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
                    <div className="flex gap-4">
                        <button
                            className="btn btn-hover hover:text-white hover:bg-error rounded"
                            title="Delete selected entries"
                        >
                            <Icons.Action.Delete className="w-4 h-4"/>
                            Delete
                        </button>
                        {selectedEntries.length === 1 && (
                            <button
                                className="btn btn-hover hover:text-white hover:bg-success rounded"
                                title="Update selected entry"
                                onClick={handleUpdate}
                            >
                                <Icons.Action.Edit className="w-4 h-4"/>
                                Update
                            </button>
                        )}
                    </div>
                )}
            </div>
            <div className="flex gap-4">
                <button
                    className="btn btn-warning rounded"
                    onClick={() => handleReset()}
                    title="Reset filters"
                >
                    <Icons.Action.Reset className="w-4 h-4"/>
                    Reset
                </button>
                {/*TODO: not all the components have add button */}
                <button
                    className="btn btn-info rounded"
                    title="Create new entry"
                    onClick={handleCreate}
                >
                    <Icons.Action.Add className="w-4 h-4"/>
                    Create
                </button>
            </div>
        </div>
    );
}