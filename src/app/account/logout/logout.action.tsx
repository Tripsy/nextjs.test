import {ApiError} from '@/lib/exceptions/api.error';
import {lang} from '@/config/lang';
import {ResponseFetch} from '@/lib/api';
import {clearAuth, logoutAccount} from '@/lib/services/account.service';
import {LogoutSituation, LogoutState} from '@/app/account/logout/logout.definition';

export async function logoutAction(): Promise<LogoutState> {
    try {
        const fetchResponse: ResponseFetch<null> = await logoutAccount();

        if (fetchResponse?.success) {
            const authResponse = await clearAuth();

            if (!authResponse?.success) {
                return {
                    message: authResponse?.message || null,
                    situation: 'error'
                };
            }
        }

        return {
            message: fetchResponse?.message || null,
            situation: fetchResponse?.success ? 'success' : 'error'
        };
    } catch (error: unknown) {
        let message: string = lang('logout.message.error') ?? 'An error occurred during logout.';
        const situation: LogoutSituation = 'error';

        if (error instanceof ApiError) {
            switch (error.status) {
                case 401:
                    message = lang('logout.message.not_logged_in');
                    break;
            }
        }

        return {
            message: message,
            situation: situation,
        };
    }
}