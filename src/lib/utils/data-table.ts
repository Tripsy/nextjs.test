import type { Nullable } from 'primereact/ts-helpers';
import type { DataSourceType } from '@/config/data-source';
import { formatDate } from '@/lib/utils/date';

type MatchModeType = 'contains' | 'equals' | 'dateAfter' | 'dateBefore';

export function createFilterHandlers<K extends keyof DataSourceType>(
	update: <T extends keyof DataSourceType[K]['dataTableFilter']>(
		newFilters: Pick<DataSourceType[K]['dataTableFilter'], T>,
	) => void,
) {
	return {
		handleInputChange: <
			F extends keyof DataSourceType[K]['dataTableFilter'],
		>(
			field: F,
			value: string,
		) =>
			update({
				[field]: { value, matchMode: 'contains' as MatchModeType },
			} as Pick<DataSourceType[K]['dataTableFilter'], F>),

		handleSelectChange: <
			F extends keyof DataSourceType[K]['dataTableFilter'],
		>(
			field: F,
			value: string,
		) =>
			update({
				[field]: { value, matchMode: 'equals' as MatchModeType },
			} as Pick<DataSourceType[K]['dataTableFilter'], F>),

		handleCheckboxChange: <
			F extends keyof DataSourceType[K]['dataTableFilter'],
		>(
			field: F,
			value: boolean,
		) =>
			update({
				[field]: { value, matchMode: 'equals' },
			} as Pick<DataSourceType[K]['dataTableFilter'], F>),

		handleDateChange: <
			F extends keyof DataSourceType[K]['dataTableFilter'],
		>(
			field: F,
			value: Nullable<Date>,
			matchMode: MatchModeType,
		) =>
			update({
				[field]: { value: formatDate(value), matchMode: matchMode },
			} as Pick<DataSourceType[K]['dataTableFilter'], F>),
	};
}
