'use client';

import Link from 'next/link';
import { Icons } from '@/app/_components/icon.component';
import { useAuth } from '@/app/_providers/auth.provider';
import Routes from '@/config/routes';
import { UserRoleEnum } from '@/lib/entities/user.model';

export function UserMenu() {
	const { auth, authStatus } = useAuth();

	if (authStatus === 'loading') {
		return (
			<div className="w-8 h-8 animate-pulse rounded-full bg-gray-300" />
		);
	}

	return (
		<div className="dropdown dropdown-end dropdown-hover">
			<button type="button">
				<Icons.User className="w-5 h-5 cursor-pointer" />
			</button>
			{authStatus === 'unauthenticated' && (
				<ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-36 p-2 shadow-sm">
					<li>
						<Link href={Routes.get('login')} title="Sign in">
							Login
						</Link>
					</li>
					<li>
						<Link
							href={Routes.get('register')}
							title="Create account"
						>
							Register
						</Link>
					</li>
				</ul>
			)}
			{authStatus === 'authenticated' && (
				<ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-36 p-2 shadow-sm">
					<li>
						<Link href={Routes.get('account-me')}>My account</Link>
					</li>
					{auth?.role &&
						[UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR].includes(
							auth.role,
						) && (
							<li>
								<Link href={Routes.get('dashboard')}>
									Dashboard
								</Link>
							</li>
						)}
					<li>
						<Link href={Routes.get('logout')} prefetch={false}>
							Logout
						</Link>
					</li>
				</ul>
			)}
		</div>
	);
}
