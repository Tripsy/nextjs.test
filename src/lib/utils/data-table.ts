import {DropdownChangeEvent} from 'primereact/dropdown';
import {CheckboxChangeEvent} from 'primereact/checkbox';
import {Nullable} from 'primereact/ts-helpers';
import {formatDate} from '@/lib/utils/date';
import {DataSourceType} from '@/config/data-source';

export function createFilterHandlers<K extends keyof DataSourceType>(
    update: <T extends keyof DataSourceType[K]['dataTableFilter']>(
        newFilters: Pick<DataSourceType[K]['dataTableFilter'], T>
    ) => void
) {
    return {
        handleTermChange: (value: string) =>
            update({global: {value: value, matchMode: 'contains'}}),

        handleStatusChange: (e: DropdownChangeEvent) =>
            update({status: {value: e.value, matchMode: 'equals'}}),

        handleIsDeletedChange: (e: CheckboxChangeEvent) =>
            update({is_deleted: {value: e.checked ?? false, matchMode: 'equals'}}),

        handleCreateDateStartChange: (e: { value: Nullable<Date> }) =>
            update({create_date_start: {value: formatDate(e.value), matchMode: 'dateAfter'}}),

        handleCreateDateEndChange: (e: { value: Nullable<Date> }) =>
            update({create_date_end: {value: formatDate(e.value), matchMode: 'dateBefore'}}),
    };
}

