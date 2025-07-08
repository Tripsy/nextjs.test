import {UserModel, UserRoleEnum} from '@/lib/models/user.model';
import {getResponseData, ResponseFetch} from '@/lib/api';
import {normalizeDates} from '@/lib/utils/model';

export type AuthModel = UserModel<Date>  & {
    permissions: string[];
} | null;

export function isAdmin(data: AuthModel): boolean {
    return data?.role === UserRoleEnum.ADMIN;
}

export function isOperator(data: AuthModel): boolean {
    return data?.role === UserRoleEnum.OPERATOR;
}

export function isAuthenticated(auth: AuthModel): boolean {
    return auth !== null;
}

export function hasPermission(auth: AuthModel, permission?: string): boolean {
    if (!isAuthenticated(auth)) {
        return false;
    }

    if (isAdmin(auth)) {
        return true;
    }

    if (isOperator(auth)) {
        if (permission) {
            return auth?.permissions.includes(permission) || false;
        } else {
            return true;
        }
    }

    return false;
}

export function handleAuthResponse(fetchResponse: ResponseFetch<AuthModel> | undefined): AuthModel {
    if (fetchResponse?.success) {
        const responseData = getResponseData(fetchResponse);

        if (responseData) {
            return normalizeDates(responseData) as AuthModel;
        } else {
            throw new Error('Could not retrieve auth model (eg: empty response data)');
        }
    } else {
        throw new Error(fetchResponse?.message || 'Could not retrieve auth model (eg: request failed)');
    }
}