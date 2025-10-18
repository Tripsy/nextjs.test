import type { CheckboxChangeEvent } from 'primereact/checkbox';
import type { DropdownChangeEvent } from 'primereact/dropdown';
import type { Nullable } from 'primereact/ts-helpers';
import type { DataSourceType } from '@/config/data-source';
import { formatDate } from '@/lib/utils/date';

export function createFilterHandlers<K extends keyof DataSourceType>(
	update: <T extends keyof DataSourceType[K]['dataTableFilter']>(
		newFilters: Pick<DataSourceType[K]['dataTableFilter'], T>,
	) => void,
) {
	return {
		handleTermChange: (value: string) =>
			update({ global: { value: value, matchMode: 'contains' } }),

		handleStatusChange: (e: DropdownChangeEvent) =>
			update({ status: { value: e.value, matchMode: 'equals' } }),

		handleIsDeletedChange: (e: CheckboxChangeEvent) =>
			update({
				is_deleted: { value: e.checked ?? false, matchMode: 'equals' },
			}),

		handleCreateDateStartChange: (e: { value: Nullable<Date> }) =>
			update({
				create_date_start: {
					value: formatDate(e.value),
					matchMode: 'dateAfter',
				},
			}),

		handleCreateDateEndChange: (e: { value: Nullable<Date> }) =>
			update({
				create_date_end: {
					value: formatDate(e.value),
					matchMode: 'dateBefore',
				},
			}),
	};
}
