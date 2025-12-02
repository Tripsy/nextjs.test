export enum UserRoleEnum {
	ADMIN = 'admin',
	MEMBER = 'member',
	OPERATOR = 'operator',
}

export enum UserStatusEnum {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	PENDING = 'pending',
}

export enum LanguageEnum {
	EN = 'en',
	RO = 'ro',
}

export type UserModel<D = Date | string> = {
	id: number;
	name: string;
	email: string;
	email_verified_at: D;
	password_updated_at: D;
	status: UserStatusEnum;
	language: LanguageEnum;
	role: UserRoleEnum;
	created_at: D;
	updated_at: D;
	deleted_at: D;
};
