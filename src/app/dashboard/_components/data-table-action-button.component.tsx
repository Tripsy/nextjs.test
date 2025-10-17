import {getActionIcon} from '@/components/icon.component';
import React from 'react';
import {DataSourceType} from '@/config/data-source';
import {lang} from '@/config/lang';

export function DataTableActionButton({
    dataSource,
    actionName,
    className,
    handleClick
}: {
    dataSource: keyof DataSourceType;
    actionName: string;
    className?: string;
    handleClick: () => void
}) {
    const ActionIcon = getActionIcon(actionName);
    const actionTitle = lang(`${dataSource}.action.${actionName}.title`);
    const actionLabel = lang(`${dataSource}.action.${actionName}.label`);

    return (
        <button
            className={className || 'btn'}
            title={actionTitle}
            onClick={handleClick}
        >
            <ActionIcon/>
            {actionLabel}
        </button>
    );
}