import type { DataTableFilterMetaData } from 'primereact/datatable';
import {
	CapitalizeBodyTemplate,
	DateBodyTemplate, ViewBodyTemplate,
} from '@/app/dashboard/_components/data-table-row.component';
import type { DataTableColumnType } from '@/config/data-source';
import type { LogDataModel } from '@/lib/models/log-data.model';
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
	dataTableFilter: DataTableLogDataFiltersType;
	model: LogDataModel;
};

const DataTableColumnsLogData: DataTableColumnType<LogDataModel>[] = [
	{ field: 'id', header: 'ID', sortable: true, body: ViewBodyTemplate },
	{ field: 'category', header: 'Category', body: CapitalizeBodyTemplate },
	{ field: 'level', header: 'Level', body: CapitalizeBodyTemplate },
	{ field: 'message', header: 'Message' },
	{
		field: 'created_at',
		header: 'Created At',
		sortable: true,
		body: DateBodyTemplate,
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
			position: 'left' as const,
			button: {
				className: 'btn btn-action-view',
			},
		},
	},
};
