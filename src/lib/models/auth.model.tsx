import {UserModel, UserRoleEnum} from '@/lib/models/user.model';

export type AuthModel = UserModel<Date> | null;

export function isAdmin(data: AuthModel): boolean {
    return data?.role === UserRoleEnum.ADMIN;
}

export function isOperator(data: AuthModel): boolean {
    return data?.role === UserRoleEnum.OPERATOR;
}

export function isAuthenticated(data: AuthModel): boolean {
    return data !== null;
}

// if (!isLoading && isAuthenticated && roles.length > 0) {
//     const hasRole = roles.some(role => user?.roles?.includes(role));
//     if (!hasRole) {
//         router.push('/unauthorized');
//     }
// }