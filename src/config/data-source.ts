import type React from 'react';
import {
	DataSourceConfigCronHistory,
	type DataSourceCronHistoryType,
} from '@/app/dashboard/cron-history/cron-history.definition';
import {
	DataSourceConfigLogData,
	type DataSourceLogDataType,
} from '@/app/dashboard/log-data/log-data.definition';
import {
	DataSourceConfigPermissions,
	type DataSourcePermissionsType,
} from '@/app/dashboard/permissions/permissions.definition';
import {
	DataSourceConfigTemplates,
	type DataSourceTemplatesType,
} from '@/app/dashboard/templates/templates.definition';
import {
	DataSourceConfigUsers,
	type DataSourceUsersType,
} from '@/app/dashboard/users/users.definition';
import type { HandleChangeType } from '@/components/form/form-element.component';
import type { ValidationReturnType } from '@/hooks';
import type { FormSituationType } from '@/lib/types';
import type { ResponseFetch } from '@/lib/utils/api';

export type DataSourceType = {
	users: DataSourceUsersType;
	permissions: DataSourcePermissionsType;
	log_data: DataSourceLogDataType;
	cron_history: DataSourceCronHistoryType;
	templates: DataSourceTemplatesType;
};

export type DataSourceModel<K extends keyof DataSourceType> =
	DataSourceType[K]['model'];
export type DataSourceFormValues<K extends keyof DataSourceType> =
	DataSourceType[K] extends { formValues: infer F }
		? F extends Record<string, unknown>
			? F
			: Record<string, unknown>
		: Record<string, unknown>;
export type DataSourceTableFilter<K extends keyof DataSourceType> =
	DataSourceType[K]['tableFilter'];

export type FindFunctionParamsType = {
	order_by?: string;
	direction?: 'ASC' | 'DESC';
	limit?: number;
	page?: number;
	filter?: string;
};

export type FindFunctionResponseType<K extends keyof DataSourceType> = {
	entries: DataSourceModel<K>[];
	pagination: {
		page: number;
		limit: number;
		total: number;
	};
};

// export type FindFunctionResponseType<K extends keyof DataSourceType> = {
// 	entries: DataSourceType[K]['model'][];
// 	pagination: {
// 		page: number;
// 		limit: number;
// 		total: number;
// 	};
// };

export type FindFunctionType<K extends keyof DataSourceType> = (
	params: FindFunctionParamsType,
) => Promise<FindFunctionResponseType<K> | undefined>;

export type CreateFunctionType<K extends keyof DataSourceType> = (
	data: DataSourceFormValues<K>,
) => Promise<ResponseFetch<Partial<DataSourceModel<K>>>>;

// export type CreateFunctionType<K extends keyof DataSourceType> =
// 	DataSourceType[K] extends { formValues: infer F; model: infer M }
// 		? (data: F) => Promise<ResponseFetch<Partial<M>>>
// 		: never;

export type UpdateFunctionType<K extends keyof DataSourceType> = (
	data: DataSourceFormValues<K>,
	id: number,
) => Promise<ResponseFetch<Partial<DataSourceModel<K>>>>;

// export type UpdateFunctionType<K extends keyof DataSourceType> =
// 	DataSourceType[K] extends { formValues: infer F; model: infer M }
// 		? (data: F, id: number) => Promise<ResponseFetch<Partial<M>>>
// 		: never;

export type DeleteFunctionType = (
	ids: number[],
) => Promise<ResponseFetch<null>>;

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

export type DataTableSelectionModeType = 'checkbox' | 'multiple' | null;

/**
 * `permission` required to perform action (e.g. user.create)
 * `allowedEntries`
 *      free ~ not dependent on selected entries,
 *      single ~ only one entry allowed,
 *      multiple ~ multiple entries allowed
 * `position` where to display action button (left, right, hidden)
 * `function` function to perform action
 * `button` action button configuration
 */
export type DataTableActionConfigType<F, K extends keyof DataSourceType> = {
	mode: 'form' | 'action' | 'other';
	permission: string;
	allowedEntries: 'free' | 'single' | 'multiple';
	entryCustomCheck?: (entry: DataSourceModel<K>) => boolean;
	position: 'left' | 'right' | 'hidden';
	function?: F;
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

export type FormManageType<K extends keyof DataSourceType> = {
	actionName: 'create' | 'update';
	formValues: DataSourceFormValues<K>;
	errors: Partial<Record<keyof DataSourceFormValues<K>, string[]>>;
	handleChange: HandleChangeType;
	pending: boolean;
};

export type FormStateType<K extends keyof DataSourceType> = {
	dataSource: K;
	id?: number;
	values: DataSourceFormValues<K>;
	errors: Partial<Record<keyof DataSourceFormValues<K>, string[]>>;
	message: string | null;
	situation: FormSituationType;
	resultData?: Partial<DataSourceModel<K>>;
};

export type ValidateFormFunctionType<K extends keyof DataSourceType> = (
	values: DataSourceFormValues<K>,
	id?: number,
) => ValidationReturnType<DataSourceFormValues<K>>;

export type DataSourceConfigType<K extends keyof DataSourceType> = {
	dataTableState: DataTableStateType<DataSourceTableFilter<K>>;
	dataTableColumns: DataTableColumnType<DataSourceModel<K>>[]; // Fixed this line
	formState?: FormStateType<K>;
	functions: {
		find: FindFunctionType<K>;
		onRowSelect?: (entry: DataSourceModel<K>) => void;
		onRowUnselect?: (entry: DataSourceModel<K>) => void;
		displayActionEntries?: (
			entries: DataSourceModel<K>[],
		) => { id: number; label: string }[];
	} & (DataSourceFormValues<K> extends never
		? object
		: {
				validateForm?: ValidateFormFunctionType<K>;
				getFormValues?: (formData: FormData) => DataSourceFormValues<K>;
				syncFormState?: (
					state: FormStateType<K>,
					model: DataSourceModel<K>,
				) => FormStateType<K>;
			});
	actions?: DataTableActionsType<K>;
};

export const DataSourceConfig: {
	[K in keyof DataSourceType]: DataSourceConfigType<K>;
} = {
	users: DataSourceConfigUsers,
	permissions: DataSourceConfigPermissions,
	log_data: DataSourceConfigLogData,
	cron_history: DataSourceConfigCronHistory,
	templates: DataSourceConfigTemplates,
};

export type DataTablePropsType = {
	dataKey: string;
	scrollHeight?: string;
};

export function getDataSourceConfig<
	K extends keyof DataSourceType,
	P extends keyof DataSourceConfigType<K>,
>(dataSource: K, prop: P): DataSourceConfigType<K>[P] {
	return DataSourceConfig[dataSource][prop];
}
