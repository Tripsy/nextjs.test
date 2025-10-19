import type React from 'react';
import {
	DataSourceConfigUsers,
	type DataSourceUsersType,
} from '@/app/dashboard/users/users.definition';
import type { FormSituationType } from '@/lib/types';
import type { ResponseFetch } from '@/lib/utils/api';

export type FindFunctionParamsType = {
	order_by: string;
	direction: 'ASC' | 'DESC';
	limit: number;
	page: number;
	filter: string;
};

export type FindFunctionResponseType<K extends keyof DataSourceType> = {
	entries: DataSourceType[K]['model'][];
	pagination: {
		page: number;
		limit: number;
		total: number;
	};
};

export type FindFunctionType<K extends keyof DataSourceType> = (
	params: FindFunctionParamsType,
) => Promise<FindFunctionResponseType<K> | undefined>;

export type CreateFunctionType<K extends keyof DataSourceType> = (
	data: DataSourceType[K]['formState']['values'],
) => Promise<ResponseFetch<Partial<DataSourceType[K]['model']>>>;

export type UpdateFunctionType<K extends keyof DataSourceType> = (
	data: DataSourceType[K]['formState']['values'],
	id: number,
) => Promise<ResponseFetch<Partial<DataSourceType[K]['model']>>>;

export type DeleteFunctionType = (
	ids: number[],
) => Promise<ResponseFetch<null>>;

export type ValidateFormFunctionType<K extends keyof DataSourceType> = (
	values: DataSourceType[K]['formState']['values'],
	id?: number,
) => DataSourceType[K]['validationResult'];

export type DataTableSelectionModeType = 'checkbox' | 'multiple' | null;

export type DataTableStateType<Filter> = {
	reloadTrigger: number; // Flag used to reload the data table entries
	first: number;
	rows: number;
	sortField: string;
	sortOrder: 1 | 0 | -1 | null | undefined;
	filters: Filter;
};

export type DataTableColumnType<Model> = {
	field: keyof Model & string;
	header: string;
	sortable?: boolean;
	body?: (
		rowData: Model,
		column: DataTableColumnType<Model>,
	) => React.JSX.Element | string;
	style?: React.CSSProperties;
};

/**
 * `permission` required to perform action (e.g. user.create)
 * `allowedEntries`
 *      free ~ not dependent on selected entries,
 *      single ~ only one entry allowed,
 *      multiple ~ multiple entries allowed
 * `position` where to display action button (left or right)
 * `function` function to perform action
 * `button` action button configuration
 */
export type DataTableActionConfigType<F, K extends keyof DataSourceType> = {
	permission: string;
	allowedEntries: 'free' | 'single' | 'multiple';
	entryCustomCheck?: (entry: DataSourceType[K]['model']) => boolean;
	position: 'left' | 'right';
	function: F;
	button: {
		className: string;
	};
};

export type DataTableActionsType<K extends keyof DataSourceType> = {
	[key: string]: DataTableActionConfigType<unknown, K>;
} & {
	create?: DataTableActionConfigType<CreateFunctionType<K>, K>;
	update?: DataTableActionConfigType<UpdateFunctionType<K>, K>;
	delete?: DataTableActionConfigType<DeleteFunctionType, K>;
};
export type FormManageContentType<K extends keyof DataSourceType> = {
	actionName: 'create' | 'update';
	formValues: DataSourceType[K]['formValues'];
	errors: Partial<Record<keyof DataSourceType[K]['formValues'], string[]>>;
	handleChange: (
		field: keyof DataSourceType[K]['formValues'],
		value: string | boolean,
	) => void;
	pending: boolean;
}; // The props are required but marked as optional to avoid TS error when providing the children (ex: FormManageContentUsers) to DataTableManage

export type DataSourceType = {
	users: DataSourceUsersType;
};

export type FormStateType<K extends keyof DataSourceType> = {
	dataSource: keyof DataSourceType;
	id?: number;
	values: DataSourceType[K]['formValues'];
	errors: Partial<Record<keyof DataSourceType[K]['formValues'], string[]>>;
	message: string | null;
	situation: FormSituationType;
	result?: ResponseFetch<DataSourceType[K]['model']>;
};

type DataSourceConfigType<K extends keyof DataSourceType> = {
	dataTableState: DataTableStateType<DataSourceType[K]['dataTableFilter']>;
	dataTableColumns: DataTableColumnType<DataSourceType[K]['model']>[];
	formState: FormStateType<K>;
	functions: {
		find: FindFunctionType<K>;
		onRowSelect?: (entry: DataSourceType[K]['model']) => void;
		onRowUnselect?: (entry: DataSourceType[K]['model']) => void;
		validateForm: ValidateFormFunctionType<K>;
		getFormValues: (formData: FormData) => DataSourceType[K]['formValues'];
		syncFormState: (
			state: DataSourceType[K]['formState'],
			model: DataSourceType[K]['model'],
		) => DataSourceType[K]['formState'];
		getActionContentEntries?: (
			entries: DataSourceType[K]['model'][],
		) => { id: number; label: string }[];
	};
	actions?: DataTableActionsType<K>;
};

const DataSourceConfig: {
	[K in keyof DataSourceType]: DataSourceConfigType<K>;
} = {
	users: DataSourceConfigUsers,
};

export type DataTablePropsType = {
	dataKey: string;
	scrollHeight?: string;
};

export function getDataSourceConfig<
	K extends keyof DataSourceType,
	P extends keyof (typeof DataSourceConfig)[K],
>(dataSource: K, prop: P): (typeof DataSourceConfig)[K][P] {
	return DataSourceConfig[dataSource][prop];
}
