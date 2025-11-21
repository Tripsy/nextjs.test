import type {
	DeleteFunctionType,
	FindFunctionParamsType,
	FindFunctionResponseType,
	FindFunctionType,
} from '@/config/data-source';
import {
	ApiRequest,
	getResponseData,
	type ResponseFetch,
} from '@/lib/utils/api';
import { buildQueryString } from '@/lib/utils/string';

export const findMailQueue: FindFunctionType<'mail_queue'> = async (
	params: FindFunctionParamsType,
) => {
	const query = buildQueryString(params);

	const response: ResponseFetch<FindFunctionResponseType<'mail_queue'>> =
		await new ApiRequest().doFetch(`/mail-queue?${query}`);

	return getResponseData<FindFunctionResponseType<'mail_queue'>>(response);
};

export const deleteMailQueue: DeleteFunctionType = async (ids: number[]) => {
	return await new ApiRequest().doFetch(`/mail-queue`, {
		method: 'DELETE',
		body: JSON.stringify({
			ids,
		}),
	});
};
