'use client';

import type React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { useStore } from 'zustand/react';
import {
	FormFiltersDateRange,
	FormFiltersReset,
	FormFiltersSearch,
	FormFiltersSelect,
	FormFiltersShowDeleted,
} from '@/app/dashboard/_components/form-filters.component';
import { useDataTable } from '@/app/dashboard/_providers/data-table-provider';
import type { DataTableUsersFiltersType } from '@/app/dashboard/users/users.definition';
import { useSearchFilter } from '@/hooks';
import { UserRoleEnum, UserStatusEnum } from '@/lib/entities/user.model';
import { createFilterHandlers } from '@/lib/utils/data-table';
import { capitalizeFirstLetter } from '@/lib/utils/string';

const statuses = Object.values(UserStatusEnum).map((v) => ({
	label: capitalizeFirstLetter(v),
	value: v,
}));

const roles = Object.values(UserRoleEnum).map((v) => ({
	label: capitalizeFirstLetter(v),
	value: v,
}));

export const DataTableUsersFilters = (): React.JSX.Element => {
	const { stateDefault, modelStore } = useDataTable<'users'>();

	const filters = useStore(modelStore, (state) => state.tableState.filters);
	const updateTableState = useStore(
		modelStore,
		(state) => state.updateTableState,
	);

	const updateFilters = useCallback(
		(newFilters: Partial<DataTableUsersFiltersType>) => {
			updateTableState({
				filters: { ...filters, ...newFilters },
			});
		},
		[filters, updateTableState],
	);

	const handlers = useMemo(
		() => createFilterHandlers<'users'>(updateFilters),
		[updateFilters],
	);

	const {
		handleInputChange,
		handleSelectChange,
		handleCheckboxChange,
		handleDateChange,
	} = handlers;

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
				labelText="ID / Email / Name"
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

			<FormFiltersSelect
				labelText="Role"
				fieldName="role"
				fieldValue={filters.role.value}
				selectOptions={roles}
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

			<FormFiltersShowDeleted
				is_deleted={filters.is_deleted?.value}
				handleCheckboxChange={handleCheckboxChange}
			/>

			<FormFiltersReset source="DataTableUsersFilters" />
		</div>
	);
};
