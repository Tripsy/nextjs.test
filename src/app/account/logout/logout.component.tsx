'use client';

import React, {useEffect, useRef, useState} from 'react';
import {logoutAction} from '@/app/account/logout/logout.action';
import {LogoutDefaultState} from '@/app/account/logout/logout.definition';
import {Icons} from '@/components/icon.component';
import Link from 'next/link';
import Routes from '@/config/routes';
import {useAuth} from '@/providers/auth.provider';

export default function Logout() {
    const [state, setState] = useState(LogoutDefaultState);
    const {setAuth, setAuthStatus} = useAuth();

    const hasExecuted = useRef(false);

    useEffect(() => {
        if (hasExecuted.current) {
            return;
        }

        hasExecuted.current = true;

        (async () => {
            const result = await logoutAction();

            setState(result);
        })();
    }, []);

    useEffect(() => {
        if (state?.situation === 'success') {
            setAuth(null); // Clear auth state immediately after successful logout
            setAuthStatus('unauthenticated');
        }
    }, [setAuth, setAuthStatus, state?.situation]);

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