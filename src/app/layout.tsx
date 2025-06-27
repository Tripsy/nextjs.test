import type {Metadata} from "next";
import './globals.css';
import {ThemeProvider} from '@/providers/theme.provider';
import {ReactNode} from 'react';
import {lang} from '@/config/lang';

export const metadata: Metadata = {
    title: `${lang('app.name')}`,
    // description: 'Dashboard Next.js',
};

export default function RootLayout({children}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <ThemeProvider>
            <html lang="en">
            <body>
                {children}
            </body>
            </html>
        </ThemeProvider>
    );
}
