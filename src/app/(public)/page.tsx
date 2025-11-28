import type { Metadata } from 'next';
import Link from 'next/link';
import { translate } from '@/config/lang';
import Routes from '@/config/routes';
import { cfg } from '@/config/settings';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: await translate('home.meta.title', {
			app_name: cfg('app.name') as string,
		}),
	};
}

export default function Page() {
	return (
		<div>
			<main className="flex items-center">Lorem ipsum</main>
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
