'use client';

import Link from 'next/link';
import Routes from '@/config/routes';
import { getNameInitials } from '@/lib/utils/string';
import { useAuth } from '@/providers/auth.provider';

export function UserMenu() {
	const { auth, authStatus } = useAuth();

	if (authStatus === 'loading') {
		return (
			<div className="w-8 h-8 animate-pulse rounded-full bg-gray-300" />
		);
	}

	return (
		<div className="dropdown dropdown-end">
			<button type="button">
				<div className="rounded-full shadow-md bg-gray-100 p-1 cursor-pointer font-bold dark:text-black">
					{getNameInitials(auth?.name)}
				</div>
			</button>
			<ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
				<li>
					<Link href="#" prefetch={false}>
						Settings
					</Link>
				</li>
				<li>
					<Link href={Routes.get('logout')} prefetch={false}>
						Logout
					</Link>
				</li>
			</ul>
		</div>
	);
}
