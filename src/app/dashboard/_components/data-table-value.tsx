'use client';

import clsx from 'clsx';
import type { JSX } from 'react';
import { Icons } from '@/components/icon.component';
import type { DataTableColumnType } from '@/config/data-source';
import { formatDate } from '@/lib/utils/date';
import { capitalizeFirstLetter } from '@/lib/utils/string';

const statusList = {
	active: {
		label: 'Active',
		class: 'badge badge-success h-8',
		icon: <Icons.Status.Active />,
	},
	pending: {
		label: 'Pending',
		class: 'badge badge-warning h-8',
		icon: <Icons.Status.Pending />,
	},
	inactive: {
		label: 'Inactive',
		class: 'badge badge-error h-8',
		icon: <Icons.Status.Inactive />,
	},
	deleted: {
		label: 'Deleted',
		class: 'badge badge-neutral h-8',
		icon: <Icons.Status.Deleted />,
	},
};

export const DisplayDeleted = ({
	value,
	isDeleted,
}: {
	value: string | JSX.Element;
	isDeleted: boolean;
}) => {
	return <div className={clsx(isDeleted && 'line-through')}>{value}</div>;
};

export const DisplayStatus = ({
	status,
}: {
	status: keyof typeof statusList;
}) => {
	const statusProps = statusList[status as keyof typeof statusList];

	return (
		<div
			className={`${statusProps.class} w-full text-white dark:text-black`}
		>
			{statusProps.icon}
			{statusProps.label}
		</div>
	);
};

export const DisplayAction = ({
	value,
	action,
	entry,
}: {
	value: string | JSX.Element;
	action: DataTableValueOptionsType['action'];
	entry: Record<string, unknown>;
}) => {
	const triggerAction = () => {
		if (!action) {
			return;
		}

		const event = new CustomEvent('useDataTableAction', {
			detail: {
				source: action.source,
				actionName: action.name,
				entry,
			},
		});

		window.dispatchEvent(event);
	};

	return (
		<button
			type="button"
			onClick={triggerAction}
			title="View details" // TODO
			className="cursor-pointer hover:underline"
		>
			{value}
		</button>
	);
};

export type DataTableValueOptionsType = {
	capitalize?: boolean;
	markDeleted?: boolean;
	isStatus?: boolean;
	displayDate?: boolean;
	source?: string;
	action?: {
		name: string;
		source: string;
	};
};

export const DataTableValue = <T extends Record<string, unknown>>(
	entry: T,
	column: DataTableColumnType<T>,
	options: DataTableValueOptionsType,
) => {
	let value: string | JSX.Element = entry[column.field] as string;

	if (options.capitalize) {
		value = capitalizeFirstLetter(value);
	}

	if (options.displayDate) {
		value = formatDate(value, 'date-time') || '-';
	}

	if (options.isStatus && column.field === 'status') {
		const status =
			options.markDeleted && entry?.deleted_at
				? 'deleted'
				: (entry.status as keyof typeof statusList);

		value = <DisplayStatus status={status} />;
	} else {
		if (options.markDeleted) {
			value = (
				<DisplayDeleted value={value} isDeleted={!!entry?.deleted_at} />
			);
		}
	}

	if (options.action) {
		value = (
			<DisplayAction
				value={value}
				action={options.action}
				entry={entry}
			/>
		);
	}

	return value;
};
