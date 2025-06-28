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

export type UserModel = {
    id: number;
    name: string;
    email: string;
    language: string;
    status: UserStatusEnum;
    role: UserRoleEnum;
    created_at: Date | string;
    updated_at: Date | string;
} | null;

export function isAdmin(user: UserModel): boolean {
    return user?.role === UserRoleEnum.ADMIN;
}

export function isOperator(user: UserModel): boolean {
    return user?.role === UserRoleEnum.OPERATOR;
}

export function isAuthenticated(user: UserModel): boolean {
    return user !== null;
}

export function normalizeUserData(user: UserModel): UserModel {
    if (!user) {
        return null;
    }

    user.created_at = new Date(user.created_at);
    user.updated_at = new Date(user.updated_at);

    return user;
}

// if (!isLoading && isAuthenticated && roles.length > 0) {
//     const hasRole = roles.some(role => user?.roles?.includes(role));
//     if (!hasRole) {
//         router.push('/unauthorized');
//     }
// }