'use client';

import Link from 'next/link';
import React from 'react';
import Routes from '@/config/routes';
import {useAuth} from '@/providers/auth.provider';
import {getNameInitials} from '@/lib/utils/string';

export function UserMenu() {
    const {loadingAuth, auth} = useAuth();

    if (loadingAuth) {
        return (
            <div className="w-8 h-8 animate-pulse rounded-full bg-gray-300" />
        );
    }

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button">
                <div className="rounded-full shadow-md bg-gray-100 p-1 cursor-pointer font-bold dark:text-black">
                    { getNameInitials(auth?.name) }
                </div>
            </div>
            <ul tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                <li>
                    <Link
                        href="#" prefetch={false}
                    >
                        Settings
                    </Link>
                </li>
                <li>
                    <Link
                        href={Routes.get('logout')} prefetch={false}
                    >
                        Logout
                    </Link>
                </li>
            </ul>
        </div>
    );
}