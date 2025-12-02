export const PermissionEntitiesSuggestions = ['user', 'permission'];
export const PermissionOperationSuggestions = [
	'create',
	'update',
	'read',
	'find',
	'delete',
];

export type PermissionModel<D = Date | string> = {
	id: number;
	entity: string;
	operation: string;
	deleted_at: D | undefined;
};
