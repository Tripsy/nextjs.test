import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import type { Nullable } from 'primereact/ts-helpers';
import { handleReset } from '@/app/dashboard/_components/data-table-actions.component';
import { FormElement } from '@/components/form/form-element.component';
import { FormPart } from '@/components/form/form-part.component';
import { Icons } from '@/components/icon.component';
import type { DataSourceType } from '@/config/data-source';
import type { useSearchFilter } from '@/hooks';
import type { MatchModeType } from '@/lib/utils/data-table';
import { getValidDate, stringToDate } from '@/lib/utils/date';
import { generateElementId } from '@/lib/utils/string';

export type SelectOptionsType<V> = {
	label: string;
	value: V;
}[];

type HandleSelectChangeType<K extends keyof DataSourceType> = <
	F extends keyof DataSourceType[K]['dataTableFilter'],
>(
	field: F,
	value: string | number,
) => void;

export function FormFiltersSelect<K extends keyof DataSourceType, V>({
	labelText,
	fieldName,
	fieldValue,
	selectOptions,
	handleSelectChange,
}: {
	labelText: string;
	fieldName: string;
	fieldValue: string | number;
	selectOptions: SelectOptionsType<V>;
	handleSelectChange: HandleSelectChangeType<K>;
}) {
	return (
		<FormPart>
			<FormElement
				labelText={labelText}
				labelFor={generateElementId(`search-${fieldName}`)}
			>
				<Dropdown
					className="p-inputtext-sm"
					panelStyle={{ fontSize: '0.875rem' }}
					inputId={generateElementId('searchStatus')}
					value={fieldValue}
					options={selectOptions}
					onChange={(e) =>
						handleSelectChange(
							fieldName as keyof DataSourceType[K]['dataTableFilter'],
							e.value,
						)
					}
					placeholder="-any-"
					showClear
				/>
			</FormElement>
		</FormPart>
	);
}
export function FormFiltersSearch({
	labelText,
	fieldName,
	search,
	placeholderText = 'Search',
}: {
	labelText: string;
	fieldName: string;
	search: ReturnType<typeof useSearchFilter>;
	placeholderText?: string;
}) {
	return (
		<FormPart>
			<FormElement
				labelText={labelText}
				labelFor={generateElementId(`search-${fieldName}`)}
			>
				<IconField iconPosition="left">
					<InputIcon className="flex items-center">
						<Icons.Search className="w-4 h-4" />
					</InputIcon>
					<InputText
						className="p-inputtext-sm"
						id={generateElementId(`search-${fieldName}`)}
						placeholder={placeholderText}
						value={search.value}
						onChange={search.handler}
					/>
				</IconField>
			</FormElement>
		</FormPart>
	);
}

type HandleDateChangeType<K extends keyof DataSourceType> = <
	F extends keyof DataSourceType[K]['dataTableFilter'],
>(
	field: F,
	value: Nullable<Date>,
	matchMode: MatchModeType,
) => void;

export function FormFiltersDateRange<K extends keyof DataSourceType>(props: {
	labelText: string;
	startDateField: string;
	startDateValue: string;
	endDateField: string;
	endDateValue: string;
	handleDateChange: HandleDateChangeType<K>;
}) {
	const {
		labelText,
		startDateField,
		startDateValue,
		endDateField,
		endDateValue,
		handleDateChange,
	} = props;

	return (
		<FormPart>
			<FormElement
				labelText={labelText}
				labelFor={generateElementId(`search-${startDateField}`)}
			>
				<div className="flex gap-2">
					<Calendar
						className="p-inputtext-sm h-11 w-[160px]"
						id={generateElementId(`search-${startDateField}`)}
						value={stringToDate(startDateValue)}
						onChange={(e) =>
							handleDateChange(
								startDateField as keyof DataSourceType[K]['dataTableFilter'],
								e.value,
								'dateAfter',
							)
						}
						placeholder="Start Date"
						showIcon
						maxDate={getValidDate(endDateValue)}
					/>
					<Calendar
						className="p-inputtext-sm h-11 w-[160px]"
						id={generateElementId(`search-${endDateField}`)}
						value={stringToDate(endDateValue)}
						onChange={(e) =>
							handleDateChange(
								endDateField as keyof DataSourceType[K]['dataTableFilter'],
								e.value,
								'dateBefore',
							)
						}
						placeholder="End Date"
						showIcon
						minDate={getValidDate(startDateValue)}
					/>
				</div>
			</FormElement>
		</FormPart>
	);
}

export function FormFiltersShowDeleted<K extends keyof DataSourceType>({
	is_deleted = false,
	handleCheckboxChange,
}: {
	is_deleted: boolean;
	handleCheckboxChange: (
		name: keyof DataSourceType[K]['dataTableFilter'],
		value: boolean,
	) => void;
}) {
	return (
		<FormPart>
			<div className="flex flex-col justify-center h-full">
				<div>&nbsp;</div>
				<div className="flex items-center gap-2">
					<Checkbox
						inputId={generateElementId('searchIsDeleted')}
						checked={is_deleted}
						onChange={(e) =>
							handleCheckboxChange(
								'is_deleted' as keyof DataSourceType[K]['dataTableFilter'],
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
	);
}

export function FormFiltersReset({ source }: { source: string }) {
	return (
		<FormPart>
			<div className="flex flex-col justify-center h-full">
				<div>&nbsp;</div>
				<div className="flex items-center gap-2">
					<button
						type="reset"
						className="btn btn-warning rounded"
						onClick={() => handleReset(source)}
						title="Reset filters"
					>
						<Icons.Action.Reset className="w-4 h-4" />
						Reset
					</button>
				</div>
			</div>
		</FormPart>
	);
}
