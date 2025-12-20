'use client';

import type React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { useStore } from 'zustand/react';
import { useSearchFilter, useTranslation } from '@/app/_hooks';
import {
	FormFiltersReset,
	FormFiltersSearch,
	FormFiltersShowDeleted,
} from '@/app/(dashboard)/_components/form-filters.component';
import { useDataTable } from '@/app/(dashboard)/_providers/data-table-provider';
import type { DataTablePermissionsFiltersType } from '@/app/(dashboard)/dashboard/permissions/permissions.definition';
import { createFilterHandlers } from '@/lib/helpers/data-table';

export const DataTablePermissionsFilters = (): React.JSX.Element => {
	const { stateDefault, modelStore } = useDataTable<'permissions'>();

	const translationsKeys = useMemo(
		() => ['permissions.form_filters.label_global'],
		[],
	);

	const { translations } = useTranslation(translationsKeys);

	const filters = useStore(modelStore, (state) => state.tableState.filters);
	const updateTableState = useStore(
		modelStore,
		(state) => state.updateTableState,
	);

	const updateFilters = useCallback(
		(newFilters: Partial<DataTablePermissionsFiltersType>) => {
			updateTableState({
				filters: { ...filters, ...newFilters },
			});
		},
		[filters, updateTableState],
	);

	const handlers = useMemo(
		() => createFilterHandlers<'permissions'>(updateFilters),
		[updateFilters],
	);
	const { handleInputChange, handleCheckboxChange } = handlers;

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
	}, [searchGlobal, stateDefault.filters, updateTableState]);

	return (
		<div className="form-section flex-row flex-wrap gap-4 border-b border-line pb-4">
			<FormFiltersSearch
				labelText={
					translations['permissions.form_filters.label_global']
				}
				fieldName="global"
				search={searchGlobal}
			/>

			<FormFiltersShowDeleted
				is_deleted={filters.is_deleted?.value}
				handleCheckboxChange={handleCheckboxChange}
			/>

			<FormFiltersReset source="DataTablePermissionsFilters" />
		</div>
	);
};
