import type { Metadata } from 'next';
import './globals.css';
import type { ReactNode } from 'react';
import { Providers } from '@/app/providers';
import { lang } from '@/config/lang';

export const metadata: Metadata = {
	title: `${lang('app.name')}`,
	// description: 'Dashboard Next.js',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<Providers>
			<html lang="en">
				<body>{children}</body>
			</html>
		</Providers>
	);
}
