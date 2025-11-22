import type { DataTableFilterMetaData } from 'primereact/datatable';
import { DataTableValue } from '@/app/(dashboard)/_components/data-table-value';
import type { DataTableColumnType } from '@/config/data-source';
import type { CronHistoryModel } from '@/lib/entities/cron-history.model';
import {
	deleteCronHistory,
	findCronHistory,
} from '@/lib/services/cron-history.service';

export type DataTableCronHistoryFiltersType = {
	global: DataTableFilterMetaData;
	status: DataTableFilterMetaData;
	start_date_start: DataTableFilterMetaData;
	start_date_end: DataTableFilterMetaData;
};

function displayActionEntriesCronHistory(entries: CronHistoryModel[]) {
	return entries.map((entry) => ({ id: entry.id, label: entry.label }));
}

export type DataSourceCronHistoryType = {
	tableFilter: DataTableCronHistoryFiltersType;
	model: CronHistoryModel;
};

const DataTableColumnsCronHistory: DataTableColumnType<CronHistoryModel>[] = [
	{
		field: 'id',
		header: 'ID',
		sortable: true,
		body: (entry, column) =>
			DataTableValue<'cron_history'>(entry, column, {
				markDeleted: true,
				action: {
					name: 'view',
					source: 'cron_history',
				},
			}),
	},
	{
		field: 'label',
		header: 'Label',
		sortable: true,
	},
	{
		field: 'start_at',
		header: 'Start At',
		sortable: true,
		body: (entry, column) =>
			DataTableValue<'cron_history'>(entry, column, {
				displayDate: true,
			}),
	},
	{
		field: 'status',
		header: 'Status',
		body: (entry, column) =>
			DataTableValue<'cron_history'>(entry, column, {
				isStatus: true,
			}),
		style: {
			minWidth: '6rem',
			maxWidth: '6rem',
		},
	},
	{ field: 'run_time', header: 'Run Time' },
];

const DataTableCronHistoryFilters: DataTableCronHistoryFiltersType = {
	global: { value: null, matchMode: 'contains' },
	status: { value: null, matchMode: 'equals' },
	start_date_start: { value: null, matchMode: 'equals' },
	start_date_end: { value: null, matchMode: 'equals' },
};

export const DataSourceConfigCronHistory = {
	dataTableState: {
		reloadTrigger: 0,
		first: 0,
		rows: 10,
		sortField: 'id',
		sortOrder: -1 as const,
		filters: DataTableCronHistoryFilters,
	},
	dataTableColumns: DataTableColumnsCronHistory,
	functions: {
		find: findCronHistory,
		displayActionEntries: displayActionEntriesCronHistory,
	},
	actions: {
		delete: {
			mode: 'action' as const,
			permission: 'cron_history.delete',
			allowedEntries: 'multiple' as const,
			position: 'left' as const,
			function: deleteCronHistory,
			button: {
				className: 'btn btn-action-delete',
			},
		},
		view: {
			mode: 'other' as const,
			permission: 'cron_history.read',
			allowedEntries: 'single' as const,
			position: 'hidden' as const,
		},
	},
};
