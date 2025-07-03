'use client';

import Link from 'next/link';
import React, {useEffect} from 'react';
import Routes from '@/lib/routes';
import {useAuth} from '@/providers/auth.provider';
import {isAuthenticated} from '@/lib/models/auth.model';
import {useRouter} from 'next/navigation';
import {getNameInitials} from '@/lib/utils/string';

// TODO: maybe UserMenu should get auth as prop  ...the loading part doesn't have sense based on the fact this is a dashboard component
// however this logic is good for other parts of the website
export function UserMenu() {
    const router = useRouter();

    const {loading, auth} = useAuth();

    // // TODO: could be moved in a ProtectedRoute component
    // useEffect(() => {
    //     if (!loading && !isAuthenticated(auth)) {
    //         router.push(Routes.get('login'));
    //     }
    // }, [loading, auth]);

    if (loading) {
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