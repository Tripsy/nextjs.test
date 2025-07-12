'use client';

import React, {useEffect, useState} from 'react';
import {logoutAction} from '@/app/account/logout/logout.action';
import {defaultLogoutState} from '@/app/account/logout/logout.definition';
import {Icons} from '@/components/icon.component';
import {cfg} from '@/config/settings';
import {lang} from '@/config/lang';
import Link from 'next/link';
import Routes from '@/config/routes';
import {useAuth} from '@/providers/auth.provider';

export default function Logout() {
    const [state, setState] = useState(defaultLogoutState);
    const {setAuth, setLastRefreshAuth} = useAuth();

    useEffect(() => {
        const logout = async () => {
            const result = await logoutAction();

            setAuth(null); // Clear auth state immediately after successful logout
            setLastRefreshAuth(Date.now()); // Clear last refresh timestamp - prevent auto refresh after logout

            return result;
        };

        logout()
            .then(res => setState(res))
            .catch(error => {
                setState({
                    message: lang('logout.message.error') ?? 'An error occurred during logout.',
                    situation: 'error',
                });
                if (cfg('environment') === 'development') {
                    console.error(error);
                }
            });
    }, []);

    return (
        <>
            <h1 className="mb-8 text-xl font-semibold text-center">
                Logout
            </h1>
            <div className="mb-8 text-sm text-center md:max-w-xs">
                {state.situation === null && (
                    <div>
                        <Icons.Loading className="animate-spin"/> Your session will end. See you next time!
                    </div>
                )}

                {state?.situation === 'success' && state.message && (
                    <>
                        <div className="text-success">
                            <Icons.Success/> {state.message}
                        </div>

                        <p className="mt-8 text-center">
                            <span className="text-sm text-gray-500 dark:text-base-content">
                                What next? You can go back to {' '}

                                <Link
                                    href={Routes.get('login')}
                                    className="link link-info link-hover text-sm"
                                >
                                login
                            </Link>
                                {' '}or navigate to{' '}
                                <Link
                                    href={Routes.get('home')}
                                    className="link link-info link-hover text-sm"
                                >
                                home page
                            </Link>
                            </span>
                        </p>
                    </>
                )}

                {state?.situation === 'error' && state.message && (
                    <div className="text-error">
                        <Icons.Error/> {state.message}
                    </div>
                )}
            </div>
        </>
    );
}