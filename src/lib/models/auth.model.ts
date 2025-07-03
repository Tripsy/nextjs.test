import {UserModel, UserRoleEnum} from '@/lib/models/user.model';
import {getResponseData, ResponseFetch} from '@/lib/api';
import {normalizeDates} from '@/lib/utils/model';

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

export function handleAuthResponse(fetchResponse: ResponseFetch<AuthModel> | undefined): AuthModel {
    if (fetchResponse?.success) {
        const responseData = getResponseData(fetchResponse);

        if (responseData) {
            // TODO maybe include refresh session token here & caching. ..look for normalizeDates
            return normalizeDates(responseData) as AuthModel;
        } else {
            throw new Error('Could not retrieve auth model (eg: empty response data)');
        }
    } else {
        throw new Error(fetchResponse?.message || 'Could not retrieve auth model (eg: request failed)');
    }
}

// if (!isLoading && isAuthenticated && roles.length > 0) {
//     const hasRole = roles.some(role => user?.roles?.includes(role));
//     if (!hasRole) {
//         router.push('/unauthorized');
//     }
// }