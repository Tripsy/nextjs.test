import type { Metadata } from 'next';
import './globals.css';
import type { ReactNode } from 'react';
import { Providers } from '@/app/providers';
import { getLanguage, translate } from '@/config/lang';
import { cfg } from '@/config/settings';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: await translate('app.name', {
			app_name: cfg('app.name') as string,
		}),
		description: await translate('app.description', {
			app_name: cfg('app.name') as string,
		}),
	};
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const language = await getLanguage();

	return (
		<Providers>
			<html lang={language}>
				<body>{children}</body>
			</html>
		</Providers>
	);
}
