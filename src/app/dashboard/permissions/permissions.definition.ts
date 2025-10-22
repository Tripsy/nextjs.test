import type { DataTableFilterMetaData } from 'primereact/datatable';
import { z } from 'zod';
import {DataSourceType, DataTableColumnType, FormStateType} from '@/config/data-source';
import { lang } from '@/config/lang';
import {
	createPermissions,
	deletePermissions,
	findPermissions,
	restorePermissions,
	updatePermissions,
} from '@/lib/services/permissions.service';
import {PermissionEntitiesEnum, PermissionModel, PermissionOperationEnum} from "@/lib/models/permission.model";
import {IdBodyTemplate, StatusBodyTemplate} from "@/app/dashboard/_components/data-table-row.component";

export type DataTableFiltersPermissionsType = {
	global: DataTableFilterMetaData;
	is_deleted: DataTableFilterMetaData;
};

const ValidateSchemaBasePermissions = z.object({
	entity: z.nativeEnum(PermissionEntitiesEnum, {
		message: lang('permissions.validation.entity_invalid'),
	}),
	operation: z.nativeEnum(PermissionOperationEnum, {
		message: lang('permissions.validation.operation_invalid'),
	}),
});

type ValidationResultPermissionsType =
	| z.SafeParseReturnType<
			DataSourceType['permissions']['formValues'],
			z.infer<typeof ValidateSchemaBasePermissions>
	  >;

function validateFormPermissions(
	values: DataSourceType['permissions']['formValues']
): ValidationResultPermissionsType {
	return ValidateSchemaBasePermissions.safeParse(values);
}

function getFormValuesPermissions(formData: FormData): DataSourceType['permissions']['formValues'] {
	const entity = formData.get('entity');
	const validEntities = Object.values(PermissionEntitiesEnum);

	const operation = formData.get('operation');
	const validOperations = Object.values(PermissionOperationEnum);

	return {
		entity: validEntities.includes(entity as PermissionEntitiesEnum)
			? (entity as PermissionEntitiesEnum)
			: PermissionEntitiesEnum.USERS,
		operation: validOperations.includes(operation as PermissionOperationEnum)
			? (operation as PermissionOperationEnum)
			: PermissionOperationEnum.CREATE,
	};
}

function syncFormStatePermissions(
	state: FormStateType<'permissions'>,
	model: PermissionModel,
): FormStateType<'permissions'> {
	return {
		...state,
		id: model.id,
		values: {
			...state.values,
			entity: model.entity,
			operation: model.operation,
		},
	};
}

function getActionContentEntriesPermissions(entries: PermissionModel[]) {
	return entries.map((entry) => ({ id: entry.id, label: `${entry.entity}.${entry.operation}` }));
}

export type DataSourcePermissionsType = {
	dataTableFilter: DataTableFiltersPermissionsType;
	model: PermissionModel;
	formState: FormStateType<'permissions'>;
	formValues: {
		entity: PermissionEntitiesEnum;
		operation: PermissionOperationEnum;
	};
	validationResult: ValidationResultPermissionsType;
};

const DataTableColumnsPermissions: DataTableColumnType<PermissionModel>[] = [
	{ field: 'id', header: 'ID', sortable: true, body: IdBodyTemplate },
	{ field: 'entity', header: 'Entity', sortable: true },
	{ field: 'operation', header: 'Operation', sortable: true },
];

const DataTableFiltersPermissions: DataTableFiltersPermissionsType = {
	global: { value: null, matchMode: 'contains' },
	is_deleted: { value: null, matchMode: 'equals' },
};

export const DataSourceConfigPermissions = {
	dataTableState: {
		reloadTrigger: 0,
		first: 0,
		rows: 10,
		sortField: 'id',
		sortOrder: -1 as const,
		filters: DataTableFiltersPermissions,
	},
	dataTableColumns: DataTableColumnsPermissions,
	formState: {
		dataSource: 'permissions' as const,
		id: undefined,
		values: {
			entity: PermissionEntitiesEnum.USERS,
			operation: PermissionOperationEnum.CREATE,
		},
		errors: {},
		message: null,
		situation: null,
	},
	functions: {
		find: findPermissions,
		getFormValues: getFormValuesPermissions,
		validateForm: validateFormPermissions,
		syncFormState: syncFormStatePermissions,
		getActionContentEntries: getActionContentEntriesPermissions,
	},
	actions: {
		create: {
			permission: 'permission.create',
			allowedEntries: 'free' as const,
			position: 'right' as const,
			function: createPermissions,
			button: {
				className: 'btn btn-action-create',
			},
		},
		update: {
			permission: 'permission.update',
			allowedEntries: 'single' as const,
			position: 'left' as const,
			function: updatePermissions,
			button: {
				className: 'btn btn-action-update',
			},
		},
		delete: {
			permission: 'permission.delete',
			allowedEntries: 'single' as const,
			entryCustomCheck: (entry: PermissionModel) => !entry.deleted_at, // Return true if entry is not deleted
			position: 'left' as const,
			function: deletePermissions,
			button: {
				className: 'btn btn-action-delete',
			},
		},
		restore: {
			permission: 'permission.delete',
			allowedEntries: 'single' as const,
			entryCustomCheck: (entry: PermissionModel) => !!entry.deleted_at, // Return true if entry is deleted
			position: 'left' as const,
			function: restorePermissions,
			button: {
				className: 'btn btn-action-restore',
			},
		},
	},
};
