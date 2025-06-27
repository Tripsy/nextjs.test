import type {Metadata} from "next";
import './globals.css';
import {ReactNode} from 'react';
import {lang} from '@/config/lang';
import {Providers} from '@/app/providers';

export const metadata: Metadata = {
    title: `${lang('app.name')}`,
    // description: 'Dashboard Next.js',
};

export default function RootLayout({children}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <Providers>
            <html lang="en">
            <body>
                {children}
            </body>
            </html>
        </Providers>
    );
}
