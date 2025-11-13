'use client';

import type React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { useStore } from 'zustand/react';
import {
	FormFiltersDateRange,
	FormFiltersReset,
	FormFiltersSearch,
	FormFiltersSelect,
} from '@/app/dashboard/_components/form-filters.component';
import { useDataTable } from '@/app/dashboard/_providers/data-table-provider';
import type { DataTableLogDataFiltersType } from '@/app/dashboard/log-data/log-data.definition';
import { useSearchFilter } from '@/hooks';
import { LogCategoryEnum, LogLevelEnum } from '@/lib/entities/log-data.model';
import { createFilterHandlers } from '@/lib/utils/data-table';
import { capitalizeFirstLetter } from '@/lib/utils/string';

const logLevels = Object.values(LogLevelEnum).map((v) => ({
	label: capitalizeFirstLetter(v),
	value: v,
}));

const logCategories = Object.values(LogCategoryEnum).map((v) => ({
	label: capitalizeFirstLetter(v),
	value: v,
}));

export const DataTableLogDataFilters = (): React.JSX.Element => {
	const { stateDefault, modelStore } = useDataTable<'log_data'>();

	const filters = useStore(modelStore, (state) => state.tableState.filters);
	const updateTableState = useStore(
		modelStore,
		(state) => state.updateTableState,
	);

	const updateFilters = useCallback(
		(newFilters: Partial<DataTableLogDataFiltersType>) => {
			updateTableState({
				filters: { ...filters, ...newFilters },
			});
		},
		[filters, updateTableState],
	);

	const handlers = useMemo(
		() => createFilterHandlers<'log_data'>(updateFilters),
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
				labelText="ID / Pid / Message / Context"
				fieldName="global"
				search={searchGlobal}
			/>

			<FormFiltersSelect
				labelText="Category"
				fieldName="category"
				fieldValue={filters.category.value}
				selectOptions={logCategories}
				handleSelectChange={handleSelectChange}
			/>

			<FormFiltersSelect
				labelText="Level"
				fieldName="level"
				fieldValue={filters.level.value}
				selectOptions={logLevels}
				handleSelectChange={handleSelectChange}
			/>

			<FormFiltersDateRange
				labelText="Created Date"
				startDateField="create_date_start"
				startDateValue={filters.create_date_start?.value ?? ''}
				endDateField="create_date_end"
				endDateValue={filters.create_date_end?.value ?? ''}
				handleDateChange={handleDateChange}
			/>

			<FormFiltersReset source="DataTableLogDataFilters" />
		</div>
	);
};
