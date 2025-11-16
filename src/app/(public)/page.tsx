import Link from 'next/link';
import Routes from '@/config/routes';

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
