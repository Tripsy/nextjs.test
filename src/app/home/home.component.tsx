'use client';

import Link from 'next/link';
import Routes from '@/config/routes';
import React from 'react';
import {useAuth} from '@/providers/auth.provider';

export default function Home() {
    const {loading, auth} = useAuth();

    return (
        <div>
            <h1>Home</h1>
            {loading && (
                <div className="w-8 h-8 animate-pulse rounded-full bg-gray-300" />
            )}
            {!loading && auth?.name && (
                <>
                    <h2 className="text-3xl font-bold">
                        Hello, {auth.name}!
                    </h2>

                    <p>
                        <Link
                            href={Routes.get('logout')}
                            className="link link-info link-hover"
                        >
                            Logout
                        </Link>
                    </p>
                </>
            )}
        </div>
    );
}