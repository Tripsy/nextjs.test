export enum PermissionOperationEnum { // TODO should I replace this? make them suggestions and update the manage part
	CREATE = 'create',
	UPDATE = 'update',
	READ = 'read',
	FIND = 'find',
	DELETE = 'delete',
}

export enum PermissionEntitiesEnum { // TODO should I replace this?
	USERS = 'user',
	PERMISSIONS = 'permission',
}

export type PermissionModel<D = Date | string> = {
	id: number;
	entity: PermissionEntitiesEnum;
	operation: PermissionOperationEnum;
	deleted_at: D | undefined;
};
