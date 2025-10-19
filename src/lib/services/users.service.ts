import type { FormValuesUsersType } from '@/app/dashboard/users/users.definition';
import type {
	CreateFunctionType,
	DeleteFunctionType,
	FindFunctionParamsType,
	FindFunctionResponseType,
	FindFunctionType,
	UpdateFunctionType,
} from '@/config/data-source';
import {
	ApiRequest,
	getResponseData,
	type ResponseFetch,
} from '@/lib/utils/api';

export const findUsers: FindFunctionType<'users'> = async (
	params: FindFunctionParamsType,
) => {
	const query = new URLSearchParams({
		order_by: params.order_by,
		direction: params.direction,
		limit: String(params.limit),
		page: String(params.page),
		filter: params.filter,
	});

	const response: ResponseFetch<FindFunctionResponseType<'users'>> =
		await new ApiRequest().doFetch(`/users?${query}`);

	return getResponseData<FindFunctionResponseType<'users'>>(response);
};

export const createUsers: CreateFunctionType<'users'> = async (
	params: FormValuesUsersType,
) => {
	return await new ApiRequest().doFetch('/users', {
		method: 'POST',
		body: JSON.stringify(params),
	});
};

export const updateUsers: UpdateFunctionType<'users'> = async (
	params: FormValuesUsersType,
	id: number,
) => {
	return await new ApiRequest().doFetch(`/users/${id}`, {
		method: 'PUT',
		body: JSON.stringify(params),
	});
};

export const deleteUsers: DeleteFunctionType = async (ids: number[]) => {
	const id = ids[0];

	return await new ApiRequest().doFetch(`/users/${id}`, {
		method: 'DELETE',
	});
};

export const enableUsers = async (
	ids: number[],
): Promise<ResponseFetch<null>> => {
	const id = ids[0];

	return await new ApiRequest().doFetch(`/users/${id}/status/active`, {
		method: 'PATCH',
	});
};

export const disableUsers = async (
	ids: number[],
): Promise<ResponseFetch<null>> => {
	const id = ids[0];

	return await new ApiRequest().doFetch(`/users/${id}/status/inactive`, {
		method: 'PATCH',
	});
};

export const restoreUsers = async (
	ids: number[],
): Promise<ResponseFetch<null>> => {
	const id = ids[0];

	return await new ApiRequest().doFetch(`/users/${id}/restore`, {
		method: 'PATCH',
	});
};
