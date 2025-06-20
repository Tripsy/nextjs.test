import type {Metadata} from "next";
import './globals.css';
import {ThemeProvider} from '@/providers/theme.provider';
import React from 'react';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Dashboard Next.js',
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
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
