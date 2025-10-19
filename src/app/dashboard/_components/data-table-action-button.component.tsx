import {getActionIcon, Icons} from '@/components/icon.component';
import type { DataSourceType } from '@/config/data-source';
import { lang } from '@/config/lang';
import React from "react";

export function DataTableActionButton({
	dataSource,
	actionName,
	className,
	handleClick,
	disabled = false,
}: {
	dataSource: keyof DataSourceType;
	actionName: string;
	className?: string;
	handleClick: () => void;
	disabled?: boolean;
}) {
	const ActionIcon = getActionIcon(actionName);
	const actionTitle = lang(`${dataSource}.action.${actionName}.title`);
	const actionLabel = lang(`${dataSource}.action.${actionName}.label`);

	return (
		<button
			type="button"
			className={className || 'btn'}
			title={actionTitle}
			onClick={handleClick}
			disabled={disabled}
		>
			{disabled ? (
				<>
					<Icons.Loading className="w-4 h-4 animate-spin"/>
					Please wait...
				</>
			) : (
				<>
					<ActionIcon/>
					{actionLabel}
				</>
			)}
		</button>
	);
}
