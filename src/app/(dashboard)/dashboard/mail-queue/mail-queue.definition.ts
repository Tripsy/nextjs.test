import type { DataTableFilterMetaData } from 'primereact/datatable';
import { DataTableValue } from '@/app/(dashboard)/_components/data-table-value';
import type { DataTableColumnType } from '@/config/data-source';
import type { MailQueueModel } from '@/lib/entities/mail-queue.model';
import {
	deleteMailQueue,
	findMailQueue,
} from '@/lib/services/mail-queue.service';
import {formatDate} from "@/lib/utils/date";

export type DataTableMailQueueFiltersType = {
	status: DataTableFilterMetaData;
	template: DataTableFilterMetaData;
	content: DataTableFilterMetaData;
	to: DataTableFilterMetaData;
	sent_date_start: DataTableFilterMetaData;
	sent_date_end: DataTableFilterMetaData;
};

function displayActionEntriesMailQueue(entries: MailQueueModel[]) {
	return entries.map((entry) => ({
		id: entry.id,
		label: formatDate(entry.sent_at) || ''
	}));
}

export type DataSourceMailQueueType = {
	tableFilter: DataTableMailQueueFiltersType;
	model: MailQueueModel;
};

const DataTableColumnsMailQueue: DataTableColumnType<MailQueueModel>[] = [
	{
		field: 'id',
		header: 'ID',
		sortable: true,
		body: (entry, column) =>
			DataTableValue<'mail_queue'>(entry, column, {
				markDeleted: true,
				action: {
					name: 'view',
					source: 'mail_queue',
				},
			}),
	},
	{
		field: 'template',
		header: 'Template',
		body: (entry, column) =>
			DataTableValue<'mail_queue'>(entry, column, {
				customValue: entry.template?.label || 'n/a',
				action: {
					name: 'view',
					source: 'template',
				},
			}),
	},
	{
		field: 'to',
		header: 'To',
		body: (entry, column) =>
			DataTableValue<'mail_queue'>(entry, column, {
				customValue: entry.to.address,
			}),
	},
	{
		field: 'status',
		header: 'Status',
		body: (entry, column) =>
			DataTableValue<'mail_queue'>(entry, column, {
				isStatus: true,
			}),
		style: {
			minWidth: '6rem',
			maxWidth: '6rem',
		},
	},
	{
		field: 'sent_at',
		header: 'Sent At',
		sortable: true,
		body: (entry, column) =>
			DataTableValue<'mail_queue'>(entry, column, {
				displayDate: true,
			}),
	},
];

const DataTableMailQueueFilters: DataTableMailQueueFiltersType = {
	status: { value: null, matchMode: 'equals' },
	template: { value: null, matchMode: 'contains' },
	content: { value: null, matchMode: 'contains' },
	to: { value: null, matchMode: 'contains' },
	sent_date_start: { value: null, matchMode: 'equals' },
	sent_date_end: { value: null, matchMode: 'equals' },
};

export const DataSourceConfigMailQueue = {
	dataTableState: {
		reloadTrigger: 0,
		first: 0,
		rows: 10,
		sortField: 'id',
		sortOrder: -1 as const,
		filters: DataTableMailQueueFilters,
	},
	dataTableColumns: DataTableColumnsMailQueue,
	functions: {
		find: findMailQueue,
		displayActionEntries: displayActionEntriesMailQueue,
	},
	actions: {
		delete: {
			mode: 'action' as const,
			permission: 'mail_queue.delete',
			allowedEntries: 'multiple' as const,
			position: 'left' as const,
			function: deleteMailQueue,
			button: {
				className: 'btn btn-action-delete',
			},
		},
		view: {
			mode: 'other' as const,
			permission: 'mail_queue.read',
			allowedEntries: 'single' as const,
			position: 'hidden' as const,
			button: {
				className: 'btn btn-action-view',
			},
		},
		viewTemplate: {
			type: 'view' as const,
			mode: 'other' as const,
			permission: 'template.read',
			allowedEntries: 'single' as const,
			position: 'hidden' as const,
			button: {
				className: 'btn btn-action-view',
			},
		},
	},
};
