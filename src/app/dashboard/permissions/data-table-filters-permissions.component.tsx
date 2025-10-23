'use client';

import { Checkbox } from 'primereact/checkbox';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import type React from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { useStore } from 'zustand/react';
import { useDataTable } from '@/app/dashboard/_providers/data-table-provider';
import type { DataTableFiltersPermissionsType } from '@/app/dashboard/permissions/permissions.definition';
import { FormElement } from '@/components/form/form-element.component';
import { FormPart } from '@/components/form/form-part.component';
import { Icons } from '@/components/icon.component';
import { useSearchFilter } from '@/hooks';
import { createFilterHandlers } from '@/lib/utils/data-table';
import { generateElementId } from '@/lib/utils/string';

export const DataTableFiltersPermissions = (): React.JSX.Element => {
	const { stateDefault, modelStore } = useDataTable<'permissions'>();

	const filters = useStore(modelStore, (state) => state.tableState.filters);
	const updateTableState = useStore(
		modelStore,
		(state) => state.updateTableState,
	);

	const updateFilters = useCallback(
		(newFilters: Partial<DataTableFiltersPermissionsType>) => {
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
	}, [stateDefault.filters, updateTableState]);

	return (
		<div className="form-section flex-row flex-wrap gap-4 mb-4">
			<FormPart>
				<FormElement
					labelText="ID / Entity / Operation"
					labelFor={generateElementId('searchGlobal')}
				>
					<IconField iconPosition="left">
						<InputIcon className="flex items-center">
							<Icons.Search className="w-4 h-4" />
						</InputIcon>
						<InputText
							className="p-inputtext-sm"
							id={generateElementId('searchGlobal')}
							placeholder="Search"
							value={searchGlobal.value}
							onChange={searchGlobal.handler}
						/>
					</IconField>
				</FormElement>
			</FormPart>

			<FormPart className="flex flex-col justify-center">
				<div>
					<div>&nbsp;</div>
					<div className="flex items-center gap-2">
						<Checkbox
							inputId={generateElementId('searchIsDeleted')}
							checked={filters.is_deleted?.value ?? false}
							onChange={(e) =>
								handleCheckboxChange(
									'is_deleted',
									e.checked ?? false,
								)
							}
						/>
						<label
							htmlFor={generateElementId('searchIsDeleted')}
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
