import type {
	AuthTokenListType,
	LoginFormFieldsType,
} from '@/app/(public)/account/login/login.definition';
import type { RegisterFormFieldsType } from '@/app/(public)/account/register/register.definition';
import type { UserModel } from '@/lib/entities/user.model';
import { ApiRequest, type ResponseFetch } from '@/lib/utils/api';

export async function registerAccount(
	params: RegisterFormFieldsType,
): Promise<ResponseFetch<UserModel>> {
	return await new ApiRequest().doFetch('/account/register', {
		method: 'POST',
		body: JSON.stringify(params),
	});
}

export async function loginAccount(
	params: LoginFormFieldsType,
): Promise<
	ResponseFetch<{ token: string } | { authValidTokens: AuthTokenListType }>
> {
	return await new ApiRequest().doFetch('/account/login', {
		method: 'POST',
		body: JSON.stringify(params),
	});
}

export async function removeTokenAccount(
	token: string,
): Promise<ResponseFetch<null>> {
	return await new ApiRequest().doFetch('/account/token', {
		method: 'DELETE',
		body: JSON.stringify({
			ident: token,
		}),
	});
}

export async function logoutAccount(): Promise<ResponseFetch<null>> {
	return await new ApiRequest().doFetch('/account/logout', {
		method: 'DELETE',
	});
}

export async function passwordRecoverAccount(
	params: LoginFormFieldsType,
): Promise<
	ResponseFetch<{ token: string } | { authValidTokens: AuthTokenListType }>
> {
	return await new ApiRequest().doFetch('/account/login', {
		method: 'POST',
		body: JSON.stringify(params),
	});
}
