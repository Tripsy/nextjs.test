'use client';

import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown} from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import type React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { useStore } from 'zustand/react';
import { useDataTable } from '@/app/dashboard/_providers/data-table-provider';
import type { DataTableFiltersUsersType } from '@/app/dashboard/users/users.definition';
import { FormElement } from '@/components/form/form-element.component';
import { FormPart } from '@/components/form/form-part.component';
import { Icons } from '@/components/icon.component';
import { useSearchFilter } from '@/hooks';
import { UserRoleEnum, UserStatusEnum } from '@/lib/models/user.model';
import { createFilterHandlers } from '@/lib/utils/data-table';
import { getValidDate, stringToDate } from '@/lib/utils/date';
import { capitalizeFirstLetter } from '@/lib/utils/string';

const statuses = Object.values(UserStatusEnum).map((status) => ({
	label: capitalizeFirstLetter(status),
	value: status,
}));

const roles = Object.values(UserRoleEnum).map((role) => ({
	label: capitalizeFirstLetter(role),
	value: role,
}));

export const DataTableFiltersUsers = (): React.JSX.Element => {
	const { stateDefault, modelStore } = useDataTable<'users'>();

	const filters = useStore(modelStore, (state) => state.tableState.filters);
	const updateTableState = useStore(
		modelStore,
		(state) => state.updateTableState,
	);

	const updateFilters = useCallback(
		(newFilters: Partial<DataTableFiltersUsersType>) => {
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
		handleDateChange
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
	}, [
		searchGlobal,
		searchGlobal.onReset,
		stateDefault.filters,
		updateTableState,
	]);

	return (
		<div className="form-section flex-row flex-wrap gap-4 mb-4">
			<FormPart>
				<FormElement
					labelText="ID / Email / Name"
					labelFor="search-global"
				>
					<IconField iconPosition="left">
						<InputIcon className="flex items-center">
							<Icons.Search className="w-4 h-4" />
						</InputIcon>
						<InputText
							className="p-inputtext-sm"
							id="search-global"
							placeholder="Search"
							value={searchGlobal.value}
							onChange={searchGlobal.handler}
						/>
					</IconField>
				</FormElement>
			</FormPart>

			<FormPart>
				<FormElement labelText="Status" labelFor="search-status">
					<Dropdown
						className="p-inputtext-sm"
						panelStyle={{ fontSize: '0.875rem' }}
						id="search-status"
						value={filters.status.value}
						options={statuses}
						onChange={(e) => handleSelectChange('status', e.value)}
						placeholder="-any-"
						showClear
					/>
				</FormElement>
			</FormPart>

			<FormPart>
				<FormElement labelText="Role" labelFor="search-role">
					<Dropdown
						className="p-inputtext-sm"
						panelStyle={{ fontSize: '0.875rem' }}
						id="search-role"
						value={filters.role.value}
						options={roles}
						onChange={(e) => handleSelectChange('role', e.value)}
						placeholder="-any-"
						showClear
					/>
				</FormElement>
			</FormPart>

			<FormPart>
				<FormElement
					labelText="Created Date"
					labelFor="search-create-date-start"
				>
					<div className="flex gap-2">
						<Calendar
							className="p-inputtext-sm h-11 w-[160px]"
							id="search-create-date-start"
							value={stringToDate(
								filters.create_date_start?.value,
							)}
							onChange={(e) => handleDateChange('create_date_start', e.value, 'dateAfter')}
							placeholder="Start Date"
							showIcon
							maxDate={getValidDate(
								filters.create_date_end?.value,
							)}
						/>
						<Calendar
							className="p-inputtext-sm h-11 w-[160px]"
							id="search-create_date_end"
							value={stringToDate(filters.create_date_end?.value)}
							onChange={(e) => handleDateChange('create_date_end', e.value, 'dateBefore')}
							placeholder="End Date"
							showIcon
							minDate={getValidDate(
								filters.create_date_start?.value,
							)}
						/>
					</div>
				</FormElement>
			</FormPart>

			<FormPart className="flex flex-col justify-center">
				<div>
					<div>&nbsp;</div>
					<div className="flex items-center gap-2">
						<Checkbox
							inputId="is_deleted"
							checked={filters.is_deleted?.value ?? false}
							onChange={(e) => handleCheckboxChange('is_deleted', e.checked ?? false)}
						/>
						<label
							htmlFor="is_deleted"
							className="text-sm whitespace-nowrap"
						>
							Show Deleted
						</label>
					</div>
				</div>
			</FormPart>
		</div>
	);
};
