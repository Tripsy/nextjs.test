'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Icons } from '@/app/_components/icon.component';
import { useTranslation } from '@/app/_hooks';
import { useAuth } from '@/app/_providers/auth.provider';
import Routes from '@/config/routes';
import { UserRoleEnum } from '@/lib/entities/user.model';

export function UserMenu() {
	const { auth, authStatus } = useAuth();

	const translationsKeys = useMemo(
		() =>
			[
				'users.text.menu_link_login_anchor',
				'users.text.menu_link_login_title',
				'users.text.menu_link_register_anchor',
				'users.text.menu_link_register_title',
				'users.text.menu_link_logout_anchor',
				'users.text.menu_link_logout_title',
				'users.text.menu_link_account_me_anchor',
				'users.text.menu_link_account_me_title',
				'users.text.menu_link_dashboard_anchor',
				'users.text.menu_link_dashboard_title',
			] as const,
		[],
	);

	const { translations, isTranslationLoading } =
		useTranslation(translationsKeys);

	if (authStatus === 'loading' || isTranslationLoading) {
		return <div className="animate-pulse rounded-full bg-gray-300" />;
	}

	return (
		<div className="dropdown dropdown-end dropdown-hover">
			<button type="button">
				<Icons.Entity.User className="cursor-pointer" />
			</button>
			{authStatus === 'unauthenticated' && (
				<ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-36 p-2 shadow-sm">
					<li>
						<Link
							href={Routes.get('login')}
							title={
								translations['users.text.menu_link_login_title']
							}
						>
							{translations['users.text.menu_link_login_anchor']}
						</Link>
					</li>
					<li>
						<Link
							href={Routes.get('register')}
							title={
								translations[
									'users.text.menu_link_register_title'
								]
							}
						>
							{
								translations[
									'users.text.menu_link_register_anchor'
								]
							}
						</Link>
					</li>
				</ul>
			)}
			{authStatus === 'authenticated' && (
				<ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-36 p-2 shadow-sm">
					<li>
						<Link
							href={Routes.get('account-me')}
							title={
								translations[
									'users.text.menu_link_account_me_title'
								]
							}
						>
							{
								translations[
									'users.text.menu_link_account_me_anchor'
								]
							}
						</Link>
					</li>
					{auth?.role &&
						[UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR].includes(
							auth.role,
						) && (
							<li>
								<Link
									href={Routes.get('dashboard')}
									title={
										translations[
											'users.text.menu_link_dashboard_title'
										]
									}
								>
									{
										translations[
											'users.text.menu_link_dashboard_anchor'
										]
									}
								</Link>
							</li>
						)}
					<li>
						<Link
							href={Routes.get('logout')}
							prefetch={false}
							title={
								translations[
									'users.text.menu_link_logout_title'
								]
							}
						>
							{translations['users.text.menu_link_logout_anchor']}
						</Link>
					</li>
				</ul>
			)}
		</div>
	);
}
