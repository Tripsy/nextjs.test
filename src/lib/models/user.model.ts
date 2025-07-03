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

export type UserModel<D = Date | string> = {
    id: number;
    name: string;
    email: string;
    status: UserStatusEnum;
    language: string;
    role: UserRoleEnum;
    created_at: D;
    updated_at: D;
};