import Link from 'next/link';
import type { ReactNode } from 'react';
import { Footer } from '@/app/_components/layout-default.component';
import { ToggleTheme } from '@/app/_components/toggle-theme';
import Routes from '@/config/routes';

function Header() {
	return (
		<header className="fixed z-90 w-full">
			<div className="header-section justify-between">
				<div className="h-full flex items-center ">
					<Link
						href={Routes.get('home')}
						className="flex items-end hover:link-info"
					>
						<span className="text-lg font-bold">
							nextjs
							<sup className="text-xs">TEST</sup>
						</span>
					</Link>
				</div>
				<div className="flex items-center">
					<ToggleTheme />
				</div>
			</div>
		</header>
	);
}

export default async function Layout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<div className="default-layout">
			<Header />
			<main className="main-section">
				<div className="content-section">{children}</div>
			</main>
			<Footer />
		</div>
	);
}
