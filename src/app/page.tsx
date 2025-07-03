import Link from 'next/link';
import Routes from '@/lib/routes';
import React from 'react';
import Home from '@/app/home/home.component';

export default function Page() {
    return (
        <div>
            <main className="flex items-center">
                <Home/>
                {/*TODO: the home component should be deleted*/}
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <Link
                    href={Routes.get('register')}
                    className="link link-info link-hover text-sm"
                >
                    Create an account
                </Link>
                <Link
                    href={Routes.get('dashboard')}
                    className="link link-info link-hover text-sm"
                >
                    Dashboard
                </Link>
            </footer>
        </div>
    );
}
