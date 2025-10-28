import type React from 'react';
import type { SafeParseError, SafeParseSuccess } from 'zod';
import {
	DataSourceConfigLogData,
	type DataSourceLogDataType,
} from '@/app/dashboard/log-data/log-data.definition';
import {
	DataSourceConfigPermissions,
	type DataSourcePermissionsType,
} from '@/app/dashboard/permissions/permissions.definition';
import {
	DataSourceConfigUsers,
	type DataSourceUsersType,
} from '@/app/dashboard/users/users.definition';
import type { FormSituationType } from '@/lib/types';
import type { ResponseFetch } from '@/lib/utils/api';

export type FindFunctionParamsType = {
	order_by?: string;
	direction?: 'ASC' | 'DESC';
	limit?: number;
	page?: number;
	filter?: string;
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

export type CreateFunctionType<K extends keyof DataSourceType> =
	DataSourceType[K] extends { formValues: infer F; model: infer M }
		? (data: F) => Promise<ResponseFetch<Partial<M>>>
		: never;

export type UpdateFunctionType<K extends keyof DataSourceType> =
	DataSourceType[K] extends { formValues: infer F; model: infer M }
		? (data: F, id: number) => Promise<ResponseFetch<Partial<M>>>
		: never;

export type DeleteFunctionType = (
	ids: number[],
) => Promise<ResponseFetch<null>>;

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
export type DataTableActionModeType = 'form' | 'action' | 'other';

export type DataTableActionConfigType<F, K extends keyof DataSourceType> = {
	mode: DataTableActionModeType;
	permission: string;
	allowedEntries: 'free' | 'single' | 'multiple';
	entryCustomCheck?: (entry: DataSourceType[K]['model']) => boolean;
	position: 'left' | 'right';
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

export type FormManageType<K extends keyof DataSourceType> =
	DataSourceType[K] extends { formValues: infer F }
		? {
				actionName: 'create' | 'update';
				formValues: F;
				errors: Partial<Record<keyof F, string[]>>;
				handleChange: (field: keyof F, value: string | boolean) => void;
				pending: boolean;
			}
		: never;

export type DataSourceType = {
	users: DataSourceUsersType;
	permissions: DataSourcePermissionsType;
	log_data: DataSourceLogDataType;
};

export type FormStateType<K extends keyof DataSourceType> =
	DataSourceType[K] extends { formValues: infer F; model: infer M }
		? {
				dataSource: K;
				id?: number;
				values: F;
				errors: Partial<Record<keyof F, string[]>>;
				message: string | null;
				situation: FormSituationType;
				resultData?: Partial<M>;
			}
		: never;

export type FormValuesType<K extends keyof DataSourceType> =
	DataSourceType[K] extends { formValues: infer F }
		? F extends Record<string, unknown>
			? F
			: Record<string, unknown>
		: Record<string, unknown>;

export type ValidateFormFunctionType<K extends keyof DataSourceType> =
	DataSourceType[K] extends {
		formValues: infer F;
		validationResult: infer VR;
	}
		? (values: F, id?: number) => VR
		: never;

export type ValidationReturnType<T extends keyof DataSourceType> =
	| SafeParseSuccess<FormValuesType<T>>
	| SafeParseError<FormValuesType<T>>
	| undefined;

export type DataSourceConfigType<K extends keyof DataSourceType> = {
	dataTableState: DataTableStateType<DataSourceType[K]['dataTableFilter']>;
	dataTableColumns: DataTableColumnType<DataSourceType[K]['model']>[];
	formState?: FormStateType<K>;
	functions: {
		find: FindFunctionType<K>;
		onRowSelect?: (entry: DataSourceType[K]['model']) => void;
		onRowUnselect?: (entry: DataSourceType[K]['model']) => void;
		displayActionEntries?: (
			entries: DataSourceType[K]['model'][],
		) => { id: number; label: string }[];
	} & (DataSourceType[K] extends { formValues: infer F }
		? {
				validateForm?: ValidateFormFunctionType<K>;
				getFormValues?: (formData: FormData) => F;
				syncFormState?: (
					state: FormStateType<K>,
					model: DataSourceType[K]['model'],
				) => FormStateType<K>;
			}
		: object);
	actions?: DataTableActionsType<K>;
};

export const DataSourceConfig: {
	[K in keyof DataSourceType]: DataSourceConfigType<K>;
} = {
	users: DataSourceConfigUsers,
	permissions: DataSourceConfigPermissions,
	log_data: DataSourceConfigLogData,
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
