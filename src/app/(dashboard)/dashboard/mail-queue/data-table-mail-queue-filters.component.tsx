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
import type { DataTableMailQueueFiltersType } from '@/app/(dashboard)/dashboard/mail-queue/mail-queue.definition';
import { MailQueueStatusEnum } from '@/lib/entities/mail-queue.model';
import { createFilterHandlers } from '@/lib/utils/data-table';
import { capitalizeFirstLetter } from '@/lib/utils/string';

const statuses = Object.values(MailQueueStatusEnum).map((v) => ({
	label: capitalizeFirstLetter(v),
	value: v,
}));

export const DataTableMailQueueFilters = (): React.JSX.Element => {
	const { stateDefault, modelStore } = useDataTable<'mail_queue'>();

	const filters = useStore(modelStore, (state) => state.tableState.filters);
	const updateTableState = useStore(
		modelStore,
		(state) => state.updateTableState,
	);

	const updateFilters = useCallback(
		(newFilters: Partial<DataTableMailQueueFiltersType>) => {
			updateTableState({
				filters: { ...filters, ...newFilters },
			});
		},
		[filters, updateTableState],
	);

	const handlers = useMemo(
		() => createFilterHandlers<'mail_queue'>(updateFilters),
		[updateFilters],
	);

	const { handleInputChange, handleSelectChange, handleDateChange } =
		handlers;

	const searchTemplate = useSearchFilter({
		initialValue: filters.template?.value ?? '',
		debounceDelay: 1000,
		minLength: 1,
		onSearch: (value) => {
			handleInputChange('template', value);
		},
	});

	const searchContent = useSearchFilter({
		initialValue: filters.content?.value ?? '',
		debounceDelay: 1000,
		minLength: 3,
		onSearch: (value) => {
			handleInputChange('content', value);
		},
	});

	const searchTo = useSearchFilter({
		initialValue: filters.to?.value ?? '',
		debounceDelay: 1000,
		minLength: 3,
		onSearch: (value) => {
			handleInputChange('to', value);
		},
	});

	useEffect(() => {
		const handleFilterReset = () => {
			updateTableState({
				filters: stateDefault.filters,
			});

			searchTemplate.onReset();
			searchContent.onReset();
			searchTo.onReset();
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
		searchContent,
		searchTemplate,
		searchTo,
		stateDefault.filters,
		updateTableState,
	]);

	return (
		<div className="form-section flex-row flex-wrap gap-4 border-b border-line pb-4">
			<FormFiltersDateRange
				labelText="Sent Date"
				startDateField="sent_date_start"
				startDateValue={filters.sent_date_start?.value ?? ''}
				endDateField="sent_date_end"
				endDateValue={filters.sent_date_end?.value ?? ''}
				handleDateChange={handleDateChange}
			/>

			<FormFiltersSelect
				labelText="Status"
				fieldName="status"
				fieldValue={filters.status.value}
				selectOptions={statuses}
				handleSelectChange={handleSelectChange}
			/>

			<FormFiltersSearch
				labelText="Template"
				fieldName="template"
				search={searchTemplate}
			/>

			<FormFiltersSearch
				labelText="Content"
				fieldName="content"
				search={searchContent}
			/>

			<FormFiltersSearch
				labelText="To"
				fieldName="to"
				search={searchTo}
			/>

			<FormFiltersReset source="DataTableMailQueueFilters" />
		</div>
	);
};
