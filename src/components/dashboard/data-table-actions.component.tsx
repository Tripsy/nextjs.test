'use client';

import React from 'react';
import {Icons} from '@/components/icon.component';
import {useDataTable} from '@/providers/dashboard/data-table-provider';
import {DataTableSelectionModeType} from '@/types/data-table.type';

// TODO when single entry is selected show edit / activate / deactivate & restore

export function DataTableActions() {
    const {selectionMode, selectedEntries} = useDataTable();

    const isMultipleSelectionMode = (selectionMode: DataTableSelectionModeType) =>
        selectionMode === 'multiple';

    return (
        <div className="my-6 pt-4 border-t border-line flex justify-between">
            <div className="flex items-center gap-2">
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
            <div>
                <button className="btn btn-info">
                    <Icons.Action.Add className="w-4 h-4"/>
                    Create user
                </button>
            </div>
        </div>
    );
}