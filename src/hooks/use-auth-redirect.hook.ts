'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Routes from '@/config/routes';
import {lang} from '@/config/lang';
import {useAuth} from '@/providers/auth.provider';

export function useAuthRedirect() {
    const router = useRouter();
    const {loadingAuth, auth} = useAuth();

    useEffect(() => {
        if (!loadingAuth && auth) {
            const errorMessage = encodeURIComponent(lang('auth.message.already_logged_in'));
            const redirectUrl = `${Routes.get('status', {type: 'error'})}?msg=${errorMessage}`;

            router.push(redirectUrl);
        }
    }, [auth, loadingAuth, router]);
}