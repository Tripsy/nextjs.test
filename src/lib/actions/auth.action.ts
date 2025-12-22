'use server';

import { translate } from '@/config/lang';
import { cfg } from '@/config/settings';
import { type AuthModel, prepareAuthModel } from '@/lib/entities/auth.model';
import { ApiError } from '@/lib/exceptions/api.error';
import {ApiRequest, getResponseData, ResponseFetch} from "@/lib/helpers/api";
import {deleteCookie, getTrackedCookie, setupTrackedCookie} from "@/lib/helpers/session";
import {apiHeaders} from "@/lib/helpers/system";

export async function createAuth(
	sessionToken: string,
): Promise<ResponseFetch<null>> {
	if (!sessionToken) {
		return {
			message: 'No token provided',
			success: false,
		};
	}

	await setupTrackedCookie(
		{
			action: 'set',
			name: cfg('user.sessionToken') as string,
			value: sessionToken,
		},
		{
			httpOnly: true,
			maxAge: cfg('user.sessionMaxAge') as number,
		},
	);

	return {
		message: await translate('login.message.auth_success'),
		success: true,
	};
}

export async function getAuth(): Promise<ResponseFetch<AuthModel>> {
	try {
		const sessionToken = await getTrackedCookie(
			cfg('user.sessionToken') as string,
		);

		if (!sessionToken.value) {
			return {
				data: null,
				message: 'Could not retrieve auth model (eg: no session token)',
				success: false,
			};
		}

		const fetchResponse: ResponseFetch<AuthModel> | undefined =
			await new ApiRequest()
				.setRequestMode('remote-api')
				.doFetch('/account/me', {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${sessionToken.value}`,
						...(await apiHeaders()),
					},
				});

		if (fetchResponse?.success) {
			const responseData = getResponseData(fetchResponse);

			if (responseData) {
				const authModel = prepareAuthModel(responseData);

				await setupTrackedCookie(sessionToken, {
					httpOnly: true,
					maxAge: cfg('user.sessionMaxAge') as number,
				});

				return {
					data: authModel,
					message: 'Ok',
					success: true,
				};
			}
		}

		await deleteCookie(cfg('user.sessionToken') as string);

		return {
			data: null,
			message:
				fetchResponse?.message ||
				'Could not retrieve auth model (eg: unknown error)',
			success: false,
		};
	} catch (error: unknown) {
		if (error instanceof ApiError && error.status === 401) {
			await deleteCookie(cfg('user.sessionToken') as string);
		}

		return {
			data: null,
			message:
				error instanceof Error
					? error.message
					: 'Could not retrieve auth model (eg: unknown error)',
			success: false,
		};
	}
}

export async function clearAuth(): Promise<ResponseFetch<null>> {
	await deleteCookie(cfg('user.sessionToken') as string);

	return {
		message: await translate('logout.message.success'),
		success: true,
	};
}
