import Link from 'next/link';
import type React from 'react';
import { Icons } from '@/components/icon.component';
import { ToggleTheme } from '@/components/toggle-theme';
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

export default function LayoutDefault({
	children,
}: {
	children: React.ReactNode;
}) {
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
