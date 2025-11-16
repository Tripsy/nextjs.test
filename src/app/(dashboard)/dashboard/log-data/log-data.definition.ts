import type { DataTableFilterMetaData } from 'primereact/datatable';
import { DataTableValue } from '@/app/(dashboard)/_components/data-table-value';
import type { DataTableColumnType } from '@/config/data-source';
import type { LogDataModel } from '@/lib/entities/log-data.model';
import { deleteLogData, findLogData } from '@/lib/services/log-data.service';

export type DataTableLogDataFiltersType = {
	global: DataTableFilterMetaData;
	level: DataTableFilterMetaData;
	category: DataTableFilterMetaData;
	create_date_start: DataTableFilterMetaData;
	create_date_end: DataTableFilterMetaData;
};

function displayActionEntriesLogData(entries: LogDataModel[]) {
	return entries.map((entry) => ({ id: entry.id, label: entry.pid }));
}

export type DataSourceLogDataType = {
	tableFilter: DataTableLogDataFiltersType;
	model: LogDataModel;
};

const DataTableColumnsLogData: DataTableColumnType<LogDataModel>[] = [
	{
		field: 'id',
		header: 'ID',
		sortable: true,
		body: (entry, column) =>
			DataTableValue<'log_data'>(entry, column, {
				markDeleted: true,
				action: {
					name: 'view',
					source: 'log_data',
				},
			}),
	},
	{
		field: 'category',
		header: 'Category',
		sortable: true,
		body: (entry, column) =>
			DataTableValue<'log_data'>(entry, column, {
				capitalize: true,
			}),
	},
	{
		field: 'level',
		header: 'Level',
		sortable: true,
		body: (entry, column) =>
			DataTableValue<'log_data'>(entry, column, {
				capitalize: true,
			}),
	},
	{ field: 'message', header: 'Message' },
	{
		field: 'created_at',
		header: 'Created At',
		sortable: true,
		body: (entry, column) =>
			DataTableValue<'log_data'>(entry, column, {
				displayDate: true,
			}),
	},
];

const DataTableLogDataFilters: DataTableLogDataFiltersType = {
	global: { value: null, matchMode: 'contains' },
	level: { value: null, matchMode: 'equals' },
	category: { value: null, matchMode: 'equals' },
	create_date_start: { value: null, matchMode: 'equals' },
	create_date_end: { value: null, matchMode: 'equals' },
};

export const DataSourceConfigLogData = {
	dataTableState: {
		reloadTrigger: 0,
		first: 0,
		rows: 10,
		sortField: 'id',
		sortOrder: -1 as const,
		filters: DataTableLogDataFilters,
	},
	dataTableColumns: DataTableColumnsLogData,
	functions: {
		find: findLogData,
		displayActionEntries: displayActionEntriesLogData,
	},
	actions: {
		delete: {
			mode: 'action' as const,
			permission: 'log_data.delete',
			allowedEntries: 'multiple' as const,
			position: 'left' as const,
			function: deleteLogData,
			button: {
				className: 'btn btn-action-delete',
			},
		},
		view: {
			mode: 'other' as const,
			permission: 'log_data.read',
			allowedEntries: 'single' as const,
			position: 'hidden' as const,
			button: {
				className: 'btn btn-action-view',
			},
		},
	},
};
