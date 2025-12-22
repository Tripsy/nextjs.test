import type {
	LogoutSituation,
	LogoutState,
} from '@/app/(public)/account/logout/logout.definition';
import { translate } from '@/config/lang';
import { ApiError } from '@/lib/exceptions/api.error';
import type { ResponseFetch } from '@/lib/helpers/api';
import { logoutAccount } from '@/lib/services/account.service';
import { clearAuth } from '@/lib/services/auth.service';

export async function logoutAction(): Promise<LogoutState> {
	try {
		const fetchResponse: ResponseFetch<null> = await logoutAccount();

		if (fetchResponse?.success) {
			const authResponse = await clearAuth();

			if (authResponse?.success) {
				return {
					message: authResponse?.message,
					situation: 'success',
				};
			} else {
				return {
					message:
						authResponse?.message ||
						(await translate('logout.message.error')),
					situation: 'error',
				};
			}
		} else {
			return {
				message:
					fetchResponse?.message ||
					(await translate('logout.message.error')),
				situation: 'error',
			};
		}
	} catch (error: unknown) {
		let message: string = '';
		const situation: LogoutSituation = 'error';

		if (error instanceof ApiError) {
			switch (error.status) {
				case 401:
					message = await translate('logout.message.not_logged_in');
					break;
			}
		}

		return {
			message: message || (await translate('logout.message.error')),
			situation: situation,
		};
	}
}
