import {ApiRequest, getResponseData, ResponseFetch} from '@/lib/utils/api';
import {UserModel} from '@/lib/models/user.model';
import {FindFunctionParamsType, FindFunctionResponseType} from '@/config/data-source';

export const findUsers = async (params: FindFunctionParamsType): Promise<FindFunctionResponseType<UserModel> | undefined> => {
    const query = new URLSearchParams({
        order_by: params.order_by,
        direction: params.direction,
        limit: String(params.limit),
        page: String(params.page),
        filter: params.filter
    });

    const response: ResponseFetch<FindFunctionResponseType<UserModel>> = await new ApiRequest()
        .doFetch(`/users?${query}`);

    return getResponseData<FindFunctionResponseType<UserModel>>(response);
}

// TODO
// createUsers
// updateUsers
// deleteUsers