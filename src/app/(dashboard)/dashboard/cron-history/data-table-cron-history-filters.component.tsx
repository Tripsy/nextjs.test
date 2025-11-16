'use client';

import type React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { useStore } from 'zustand/react';
import { useSearchFilter } from '@/app/_hooks';
import {
	FormFiltersDateRange,
	FormFiltersReset,
	FormFiltersSearch,
	FormFiltersSelect,
} from '@/app/(dashboard)/_components/form-filters.component';
import { useDataTable } from '@/app/(dashboard)/_providers/data-table-provider';
import type { DataTableCronHistoryFiltersType } from '@/app/(dashboard)/dashboard/cron-history/cron-history.definition';
import { CronHistoryStatusEnum } from '@/lib/entities/cron-history.model';
import { createFilterHandlers } from '@/lib/utils/data-table';
import { capitalizeFirstLetter } from '@/lib/utils/string';

const statuses = Object.values(CronHistoryStatusEnum).map((v) => ({
	label: capitalizeFirstLetter(v),
	value: v,
}));

export const DataTableCronHistoryFilters = (): React.JSX.Element => {
	const { stateDefault, modelStore } = useDataTable<'cron_history'>();

	const filters = useStore(modelStore, (state) => state.tableState.filters);
	const updateTableState = useStore(
		modelStore,
		(state) => state.updateTableState,
	);

	const updateFilters = useCallback(
		(newFilters: Partial<DataTableCronHistoryFiltersType>) => {
			updateTableState({
				filters: { ...filters, ...newFilters },
			});
		},
		[filters, updateTableState],
	);

	const handlers = useMemo(
		() => createFilterHandlers<'cron_history'>(updateFilters),
		[updateFilters],
	);

	const { handleInputChange, handleSelectChange, handleDateChange } =
		handlers;

	const searchGlobal = useSearchFilter({
		initialValue: filters.global?.value ?? '',
		debounceDelay: 1000,
		minLength: 3,
		onSearch: (value) => {
			handleInputChange('global', value);
		},
	});

	useEffect(() => {
		const handleFilterReset = () => {
			updateTableState({
				filters: stateDefault.filters,
			});

			searchGlobal.onReset();
		};

		window.addEventListener(
			'filterReset',
			handleFilterReset as EventListener,
		);

		return () => {
			window.removeEventListener(
				'filterReset',
				handleFilterReset as EventListener,
			);
		};
	}, [
		searchGlobal,
		searchGlobal.onReset,
		stateDefault.filters,
		updateTableState,
	]);

	return (
		<div className="form-section flex-row flex-wrap gap-4 border-b border-line pb-4">
			<FormFiltersSearch
				labelText="ID / Label / Content"
				fieldName="global"
				search={searchGlobal}
			/>

			<FormFiltersSelect
				labelText="Status"
				fieldName="status"
				fieldValue={filters.status.value}
				selectOptions={statuses}
				handleSelectChange={handleSelectChange}
			/>

			<FormFiltersDateRange
				labelText="Start Date"
				startDateField="start_date_start"
				startDateValue={filters.start_date_start?.value ?? ''}
				endDateField="start_date_end"
				endDateValue={filters.start_date_end?.value ?? ''}
				handleDateChange={handleDateChange}
			/>

			<FormFiltersReset source="DataTableCronHistoryFilters" />
		</div>
	);
};
