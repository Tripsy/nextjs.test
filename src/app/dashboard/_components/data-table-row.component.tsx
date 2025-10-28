'use client';

import clsx from 'clsx';
import { Icons } from '@/components/icon.component';
import type { DataTableColumnType } from '@/config/data-source';
import ValueError from '@/lib/exceptions/value.error';
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

export type StatusKey = keyof typeof statusList;

export function DataTableRowStatus({ status }: { status: StatusKey }) {
	if (!(status in statusList)) {
		throw new ValueError(`Invalid status: ${status}`);
	}

	const current = statusList[status as StatusKey];

	return (
		<div className={`${current.class} w-full text-white dark:text-black`}>
			{current.icon}
			{current.label}
		</div>
	);
}

export function DataTableRowDate({ date }: { date: Date | string }) {
	return <span>{date ? formatDate(date) : '-'}</span>;
}

export function DataTableRowView<T>({ entry, value }: { entry: T, value: string }) {
	return (
		<button
			type="button"
			onClick={() => { console.log(entry)}}
			title="View details"
			className="cursor-pointer hover:underline"
		>
			{value}
		</button>
	);
}

export function DataTableRowId({
	id,
	deleted_at,
}: {
	id: number;
	deleted_at: Date | string | undefined;
}) {
	return <span className={clsx(deleted_at && 'line-through')}>{id}</span>;
}

export const IdBodyTemplate = (entry: {
	id: number;
	deleted_at?: Date | string | undefined;
}) => {
	return <DataTableRowId id={entry.id} deleted_at={entry.deleted_at} />;
};

export const StatusBodyTemplate = (entry: {
	status: StatusKey;
	deleted_at?: Date | string | undefined;
}) => {
	const status = entry.deleted_at ? 'deleted' : entry.status;

	return <DataTableRowStatus status={status} />;
};

export const DateBodyTemplate = <T extends Record<string, unknown>>(
	entry: T,
	column: DataTableColumnType<T>,
) => {
	const value = entry[column.field];

	// Only treat it as Date or string if possible
	const date: Date | string =
		value instanceof Date ? value : new Date(value as string);

	return <DataTableRowDate date={date} />;
};

export const CapitalizeBodyTemplate = <T extends Record<string, unknown>>(
	entry: T,
	column: DataTableColumnType<T>,
) => {
	const value = entry[column.field];

	return capitalizeFirstLetter(String(value));
};

export const ViewBodyTemplate = <T extends Record<string, unknown>>(
	entry: T,
	column: DataTableColumnType<T>,
) => {
	const value = entry[column.field];

	return <DataTableRowView value={String(value)} entry={entry} />;
};
