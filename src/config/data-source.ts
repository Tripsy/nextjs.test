import type React from 'react';
import type { ValidationReturnType } from '@/app/_hooks';
import {
	DataSourceConfigCronHistory,
	type DataSourceCronHistoryType,
} from '@/app/(dashboard)/dashboard/cron-history/cron-history.definition';
import {
	DataSourceConfigLogData,
	type DataSourceLogDataType,
} from '@/app/(dashboard)/dashboard/log-data/log-data.definition';
import {
	DataSourceConfigMailQueue,
	type DataSourceMailQueueType,
} from '@/app/(dashboard)/dashboard/mail-queue/mail-queue.definition';
import {
	DataSourceConfigPermissions,
	type DataSourcePermissionsType,
} from '@/app/(dashboard)/dashboard/permissions/permissions.definition';
import {
	DataSourceConfigTemplates,
	type DataSourceTemplatesType,
} from '@/app/(dashboard)/dashboard/templates/templates.definition';
import {
	DataSourceConfigUsers,
	type DataSourceUsersType,
} from '@/app/(dashboard)/dashboard/users/users.definition';
import type { FormSituationType } from '@/lib/types';
import type { ResponseFetch } from '@/lib/utils/api';

export type DataSourceType = {
	cron_history: DataSourceCronHistoryType;
	log_data: DataSourceLogDataType;
	mail_queue: DataSourceMailQueueType;
	permissions: DataSourcePermissionsType;
	templates: DataSourceTemplatesType;
	users: DataSourceUsersType;
};

export type AnyDataSourceModel = DataSourceModel<keyof DataSourceType>;
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

export type FindFunctionType<K extends keyof DataSourceType> = (
	params: FindFunctionParamsType,
) => Promise<FindFunctionResponseType<K> | undefined>;

export type CreateFunctionType<K extends keyof DataSourceType> = (
	data: DataSourceFormValues<K>,
) => Promise<ResponseFetch<Partial<DataSourceModel<K>>>>;

export type UpdateFunctionType<K extends keyof DataSourceType> = (
	data: DataSourceFormValues<K>,
	id: number,
) => Promise<ResponseFetch<Partial<DataSourceModel<K>>>>;

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
 * `type` type of action (view, create, update, delete)
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
	type?: 'view' | 'create' | 'update' | 'delete';
	mode: 'form' | 'action' | 'other';
	permission: string;
	allowedEntries: 'free' | 'single' | 'multiple';
	customEntryCheck?: (entry: DataSourceModel<K>) => boolean;
	position: 'left' | 'right' | 'hidden';
	function?: F;
	button?: {
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
	handleChange: (
		field: string,
		value: string | boolean | number | Date,
	) => void;
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
	cron_history: DataSourceConfigCronHistory,
	log_data: DataSourceConfigLogData,
	mail_queue: DataSourceConfigMailQueue,
	permissions: DataSourceConfigPermissions,
	templates: DataSourceConfigTemplates,
	users: DataSourceConfigUsers,
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
