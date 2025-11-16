import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/app/providers';
import { getLanguage, translate } from '@/config/lang';
import { cfg } from '@/config/settings';
import Link from "next/link";
import Routes from "@/config/routes";
import {ToggleTheme} from "@/components/toggle-theme";
import { Icons } from "@/components/icon.component";
import {ReactNode} from "react";

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

export function Footer() {
	return (
		<footer className="footer sm:footer-horizontal relative bg-base-100 items-center p-4">
			<aside className="grid-flow-col items-center">
				<p>
					Copyright &copy; {new Date().getFullYear()} - All right
					reserved
				</p>
			</aside>
			<nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
				<a
					href="https://github.com/Tripsy/nextjs.test/tree/main"
					title="Github repository"
					target="_blank"
					rel="noopener"
				>
					<Icons.Design.Github className="text-2xl" />
				</a>
				<a
					href="https://www.linkedin.com/in/david-gabriel-8853a7115/"
					title="LinkedIn profile - Gabriel David"
					target="_blank"
					rel="noopener"
				>
					<Icons.Design.Linkedin className="text-2xl" />
				</a>
			</nav>
		</footer>
	);
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
				<body>
					<div className="default-layout">
						<Header />
						<main className="main-section">
							<div className="content-section">{children}</div>
						</main>
						<Footer />
					</div>
				</body>
			</html>
		</Providers>
	);
}
