import type { DataTableFilterMetaData } from 'primereact/datatable';
import { z } from 'zod';
import type {
	DataSourceType,
	DataTableColumnType,
	FormStateType,
} from '@/config/data-source';
import { translateBatch } from '@/config/lang';
import {
	PermissionEntitiesEnum,
	type PermissionModel,
	PermissionOperationEnum,
} from '@/lib/entities/permission.model';
import {
	createPermissions,
	deletePermissions,
	findPermissions,
	restorePermissions,
	updatePermissions,
} from '@/lib/services/permissions.service';

export type DataTablePermissionsFiltersType = {
	global: DataTableFilterMetaData;
	is_deleted: DataTableFilterMetaData;
};

const translations = await translateBatch([
	'permissions.validation.entity_invalid',
	'permissions.validation.operation_invalid',
]);

const ValidateSchemaBasePermissions = z.object({
	entity: z.nativeEnum(PermissionEntitiesEnum, {
		message: translations['permissions.validation.entity_invalid'],
	}),
	operation: z.nativeEnum(PermissionOperationEnum, {
		message: translations['permissions.validation.operation_invalid'],
	}),
});

function validateFormPermissions(
	values: DataSourceType['permissions']['formValues'],
) {
	return ValidateSchemaBasePermissions.safeParse(values);
}

function getFormValuesPermissions(
	formData: FormData,
): DataSourceType['permissions']['formValues'] {
	const entity = formData.get('entity');
	const validEntities = Object.values(PermissionEntitiesEnum);

	const operation = formData.get('operation');
	const validOperations = Object.values(PermissionOperationEnum);

	return {
		entity: validEntities.includes(entity as PermissionEntitiesEnum)
			? (entity as PermissionEntitiesEnum)
			: PermissionEntitiesEnum.USERS,
		operation: validOperations.includes(
			operation as PermissionOperationEnum,
		)
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

function displayActionEntriesPermissions(entries: PermissionModel[]) {
	return entries.map((entry) => ({
		id: entry.id,
		label: `${entry.entity}.${entry.operation}`,
	}));
}

export type DataSourcePermissionsType = {
	tableFilter: DataTablePermissionsFiltersType;
	model: PermissionModel;
	formState: FormStateType<'permissions'>;
	formValues: {
		entity: PermissionEntitiesEnum;
		operation: PermissionOperationEnum;
	};
};

const DataTableColumnsPermissions: DataTableColumnType<PermissionModel>[] = [
	{ field: 'id', header: 'ID', sortable: true },
	{ field: 'entity', header: 'Entity', sortable: true },
	{ field: 'operation', header: 'Operation', sortable: true },
];

const DataTablePermissionsFilters: DataTablePermissionsFiltersType = {
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
		filters: DataTablePermissionsFilters,
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
		displayActionEntries: displayActionEntriesPermissions,
	},
	actions: {
		create: {
			mode: 'form' as const,
			permission: 'permission.create',
			allowedEntries: 'free' as const,
			position: 'right' as const,
			function: createPermissions,
			button: {
				className: 'btn btn-action-create',
			},
		},
		update: {
			mode: 'form' as const,
			permission: 'permission.update',
			allowedEntries: 'single' as const,
			position: 'left' as const,
			function: updatePermissions,
			button: {
				className: 'btn btn-action-update',
			},
		},
		delete: {
			mode: 'action' as const,
			permission: 'permission.delete',
			allowedEntries: 'single' as const,
			position: 'left' as const,
			customEntryCheck: (entry: PermissionModel) => !entry.deleted_at, // Return true if entry is not deleted
			function: deletePermissions,
			button: {
				className: 'btn btn-action-delete',
			},
		},
		restore: {
			mode: 'action' as const,
			permission: 'permission.delete',
			allowedEntries: 'single' as const,
			position: 'left' as const,
			customEntryCheck: (entry: PermissionModel) => !!entry.deleted_at, // Return true if entry is deleted
			function: restorePermissions,
			button: {
				className: 'btn btn-action-restore',
			},
		},
	},
};
