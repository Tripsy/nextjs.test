import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import type { Nullable } from 'primereact/ts-helpers';
import { useMemo } from 'react';
import {
	FormElement,
	type OptionsType,
} from '@/app/_components/form/form-element.component';
import { FormPart } from '@/app/_components/form/form-part.component';
import { Icons } from '@/app/_components/icon.component';
import {
	useElementIds,
	type useSearchFilter,
	useTranslation,
} from '@/app/_hooks';
import { handleReset } from '@/app/(dashboard)/_components/data-table-actions.component';
import type {
	DataSourceTableFilter,
	DataSourceType,
} from '@/config/data-source';
import type { MatchModeType } from '@/lib/utils/data-table';
import { getValidDate, stringToDate } from '@/lib/utils/date';

type HandleSelectChangeType<K extends keyof DataSourceType> = <
	F extends keyof DataSourceTableFilter<K>,
>(
	field: F,
	value: string,
) => void;

export function FormFiltersSelect<K extends keyof DataSourceType>({
	labelText,
	fieldName,
	fieldValue,
	selectOptions,
	handleSelectChange,
}: {
	labelText: string;
	fieldName: string;
	fieldValue: string | number;
	selectOptions: OptionsType;
	handleSelectChange: HandleSelectChangeType<K>;
}) {
	const elementKey = `search-${fieldName}`;
	const elementIds = useElementIds([elementKey]);

	const translationsKeys = useMemo(
		() => ['dashboard.text.placeholder_select_default'],
		[],
	);

	const { translations } = useTranslation(translationsKeys);

	return (
		<FormPart>
			<FormElement
				labelText={labelText}
				labelFor={elementIds[elementKey]}
			>
				<Dropdown
					className="p-inputtext-sm"
					panelStyle={{ fontSize: '0.875rem' }}
					inputId={elementIds[elementKey]}
					value={fieldValue}
					options={selectOptions}
					onChange={(e) =>
						handleSelectChange(
							fieldName as keyof DataSourceTableFilter<K>,
							e.value,
						)
					}
					placeholder={
						translations[
							'dashboard.text.placeholder_select_default'
						]
					}
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
	const elementKey = `search-${fieldName}`;
	const elementIds = useElementIds([elementKey]);

	return (
		<FormPart>
			<FormElement
				labelText={labelText}
				labelFor={elementIds[elementKey]}
			>
				<IconField iconPosition="left">
					<InputIcon className="flex items-center">
						<Icons.Search />
					</InputIcon>
					<InputText
						className="p-inputtext-sm"
						id={elementIds[elementKey]}
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
	F extends keyof DataSourceTableFilter<K>,
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

	const elementStartKey = `search-${startDateField}`;
	const elementEndKey = `search-${endDateField}`;
	const elementIds = useElementIds([elementStartKey, elementEndKey]);

	const translationsKeys = useMemo(
		() => [
			'dashboard.text.placeholder_start_date',
			'dashboard.text.placeholder_end_date',
		],
		[],
	);

	const { translations } = useTranslation(translationsKeys);

	return (
		<FormPart>
			<FormElement
				labelText={labelText}
				labelFor={elementIds[elementStartKey]}
			>
				<div className="flex gap-2">
					<Calendar
						className="p-inputtext-sm h-11 w-[160px]"
						id={elementIds[elementStartKey]}
						value={stringToDate(startDateValue)}
						onChange={(e) =>
							handleDateChange(
								startDateField as keyof DataSourceTableFilter<K>,
								e.value,
								'dateAfter',
							)
						}
						placeholder={
							translations[
								'dashboard.text.placeholder_start_date'
							]
						}
						showIcon
						maxDate={getValidDate(endDateValue)}
					/>
					<Calendar
						className="p-inputtext-sm h-11 w-[160px]"
						id={elementIds[elementEndKey]}
						value={stringToDate(endDateValue)}
						onChange={(e) =>
							handleDateChange(
								endDateField as keyof DataSourceTableFilter<K>,
								e.value,
								'dateBefore',
							)
						}
						placeholder={
							translations['dashboard.text.placeholder_end_date']
						}
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
		name: keyof DataSourceTableFilter<K>,
		value: boolean,
	) => void;
}) {
	const elementIds = useElementIds(['searchIsDeleted']);

	const translationsKeys = useMemo(
		() => ['dashboard.text.label_checkbox_show_deleted'],
		[],
	);

	const { translations } = useTranslation(translationsKeys);

	return (
		<FormPart>
			<div className="flex flex-col justify-center h-full">
				<div>&nbsp;</div>
				<div className="flex items-center gap-2">
					<Checkbox
						inputId={elementIds.searchIsDeleted}
						checked={is_deleted}
						onChange={(e) =>
							handleCheckboxChange(
								'is_deleted' as keyof DataSourceTableFilter<K>,
								e.checked ?? false,
							)
						}
					/>
					<label
						htmlFor={elementIds.searchIsDeleted}
						className="text-sm whitespace-nowrap"
					>
						{
							translations[
								'dashboard.text.label_checkbox_show_deleted'
							]
						}
					</label>
				</div>
			</div>
		</FormPart>
	);
}

export function FormFiltersReset({ source }: { source: string }) {
	const translationsKeys = useMemo(() => ['dashboard.text.label_reset'], []);

	const { translations } = useTranslation(translationsKeys);

	return (
		<FormPart>
			<div className="flex flex-col justify-center h-full">
				<div>&nbsp;</div>
				<div className="flex items-center">
					<button
						type="reset"
						className="btn btn-warning rounded"
						onClick={() => handleReset(source)}
						title="Reset filters"
					>
						<Icons.Action.Reset />
						{translations['dashboard.text.label_reset']}
					</button>
				</div>
			</div>
		</FormPart>
	);
}
