'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Icons } from '@/app/_components/icon.component';
import { Loading } from '@/app/_components/loading.component';
import { useTranslation } from '@/app/_hooks';
import { useAuth } from '@/app/_providers/auth.provider';
import { useToast } from '@/app/_providers/toast.provider';
import { AuthTokenList } from '@/app/(public)/account/login/login.component';
import Routes from '@/config/routes';
import {
	type AuthTokenListType,
	getSessions,
} from '@/lib/services/account.service';
import { formatDate } from '@/lib/utils/date';
import { capitalizeFirstLetter } from '@/lib/utils/string';

export default function AccountMe() {
	const { auth, authStatus } = useAuth();
	const { showToast } = useToast();
	const [sessions, setSessions] = useState<AuthTokenListType>([]);

	const translationsKeys = useMemo(
		() => [
			'account_me.message.session_destroy_success',
			'account_me.message.session_destroy_error',
			'account_me.message.edit_success',
			'account_me.message.email_update_success',
			'account_me.message.password_change_success',
		],
		[],
	);

	const { translations, isTranslationLoading } =
		useTranslation(translationsKeys);

	useEffect(() => {
		if (authStatus === 'authenticated') {
			(async () => {
				setSessions(await getSessions());
			})();
		}
	}, [authStatus]);

	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const fromParam = searchParams.get('from');

		if (fromParam && !isTranslationLoading) {
			switch (fromParam) {
				case 'edit':
					showToast({
						severity: 'success',
						summary: 'Success',
						detail: translations['account_me.message.edit_success'],
					});
					break;
				case 'emailUpdate':
					showToast({
						severity: 'success',
						summary: 'Success',
						detail: translations[
							'account_me.message.email_update_success'
						],
					});
					break;
				case 'passwordChange':
					showToast({
						severity: 'success',
						summary: 'Success',
						detail: translations[
							'account_me.message.password_change_success'
						],
					});
					break;
			}

			const newUrl = Routes.get('account-me');
			router.replace(newUrl, { scroll: false });
		}
	}, [
		searchParams.get,
		showToast,
		isTranslationLoading,
		translations,
		router,
	]);

	if (authStatus === 'loading') {
		return <Loading />;
	}

	if (!auth) {
		return (
			<div>
				<h1 className="text-center">Not Authenticated</h1>
				<div className="text-sm">
					<Icons.Error className="text-error mr-1" />
					Please{' '}
					<Link
						href={Routes.get('login')}
						title="Sign in"
						className="link link-info link-hover"
					>
						{' '}
						log in{' '}
					</Link>{' '}
					to view your account.
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<h1 className="text-center">My Account</h1>
				<Link
					href={Routes.get('account-edit')}
					prefetch={false}
					title="Edit my account"
					className="btn btn-success btn-sm"
				>
					<Icons.Action.Update className="w-4 h-4" />
					Edit
				</Link>
			</div>

			{/* Personal Information */}
			<div className="card bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title">
						<Icons.User className="w-5 h-5" />
						Personal Information
					</h2>

					<div className="space-y-4">
						<div className="flex justify-between items-center py-2 border-b border-base-300">
							<div>
								<div className="label label-text font-semibold">
									Full Name
								</div>
								<p className="text-lg">{auth.name}</p>
							</div>
						</div>

						<div className="flex justify-between items-center py-2 border-b border-base-300">
							<div>
								<div className="label label-text font-semibold">
									Email Address
								</div>
								<p className="text-lg">{auth.email}</p>
								{auth.email_verified_at ? (
									<span className="badge badge-success badge-sm mt-1">
										<Icons.Ok className="w-3 h-3" />
										Verified
									</span>
								) : (
									<span className="badge badge-warning badge-sm mt-1">
										<Icons.Warning className="w-3 h-3" />
										Not Verified
									</span>
								)}
							</div>
							<Link
								href={Routes.get('email-update')}
								className="btn btn-outline btn-sm"
								title="Update email address"
							>
								<Icons.Action.Update className="w-4 h-4" />
								Change
							</Link>
						</div>

						<div className="flex justify-between items-center py-2">
							<div>
								<div className="label label-text font-semibold">
									Language preference
								</div>
								<p className="text-lg">
									{capitalizeFirstLetter(auth.language)}
								</p>
							</div>
						</div>

						<div className="flex justify-between items-center py-2">
							<div>
								<div className="label label-text font-semibold">
									Member Since
								</div>
								<p className="text-lg">
									{formatDate(auth.created_at, 'MMMM D, Y')}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Security & Account */}
			<div className="card bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title">
						<Icons.Security className="w-5 h-5" />
						Security & Account
					</h2>

					<div className="space-y-4">
						{/* Password Section */}
						<div className="flex justify-between items-center py-2 border-b border-base-300">
							<div>
								<div className="label label-text font-semibold">
									Password
								</div>
								<p className="text-sm text-base-content/70">
									Last updated:{' '}
									{formatDate(
										auth.password_updated_at,
										'date-time',
									)}
								</p>
							</div>
							<Link
								href={Routes.get('password-update')}
								className="btn btn-outline btn-sm"
								title="Update password"
							>
								<Icons.Password className="w-4 h-4" />
								Change
							</Link>
						</div>
					</div>

					{/* Quick Actions */}
					<div className="card-actions justify-end mt-6">
						<Link
							href={Routes.get('account-delete')}
							className="btn btn-error btn-sm"
						>
							<Icons.Action.Delete className="w-4 h-4" />
							Delete Account
						</Link>
					</div>
				</div>
			</div>

			{/* Sessions Management */}
			<div className="card bg-base-200">
				<div className="card-body">
					<h2 className="card-title">
						<Icons.Session className="w-5 h-5" />
						Sessions
					</h2>

					<div className="py-2 space-y-4">
						<AuthTokenList
							tokens={sessions}
							callbackAction={(success, message) => {
								showToast({
									severity: success ? 'success' : 'error',
									summary: success ? 'Success' : 'Error',
									detail: translations[
										`account_me.message.${message}`
									],
								});
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
