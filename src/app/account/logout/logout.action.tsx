import {ApiError} from '@/lib/exceptions/api.error';
import {lang} from '@/config/lang';
import {ResponseFetch} from '@/lib/utils/api';
import {logoutAccount} from '@/lib/services/account.service';
import {LogoutSituation, LogoutState} from '@/app/account/logout/logout.definition';
import {clearAuth} from '@/actions/auth.actions';

export async function logoutAction(): Promise<LogoutState> {
    try {
        const fetchResponse: ResponseFetch<null> = await logoutAccount();

        if (fetchResponse?.success) {
            const authResponse = await clearAuth();

            if (authResponse?.success) {
                return {
                    message: authResponse?.message,
                    situation: 'success'
                };
            } else {
                return {
                    message: authResponse?.message || lang('logout.message.error'),
                    situation: 'error'
                };
            }
        } else {
            return {
                message: fetchResponse?.message || lang('logout.message.error'),
                situation: 'error'
            };
        }
    } catch (error: unknown) {
        let message: string = lang('logout.message.error');
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