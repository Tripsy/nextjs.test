export enum PermissionOperationEnum {
	CREATE = 'create',
	UPDATE = 'update',
	READ = 'read',
	FIND = 'find',
	DELETE = 'delete',
}

export enum PermissionEntitiesEnum {
	USERS = 'user',
	PERMISSIONS = 'permission',
}

export type PermissionModel<D = Date | string> = {
	id: number;
	entity: PermissionEntitiesEnum;
	operation: PermissionOperationEnum;
	deleted_at: D | undefined;
};


