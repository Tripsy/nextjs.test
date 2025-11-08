'use client';

import { useStore } from 'zustand/react';
import { useDataTable } from '@/app/dashboard/_providers/data-table-provider';
import { type UserModel, UserStatusEnum } from '@/lib/models/user.model';
import { formatDate } from '@/lib/utils/date';

export function ViewUser() {
	const { modelStore } = useDataTable<'users'>();
	const actionEntry = useStore(
		modelStore,
		(state) => state.actionEntry,
	) as UserModel | null;

	if (!actionEntry) {
		return <div className="text-center p-6">No user selected.</div>;
	}

	const {
		id,
		name,
		email,
		role,
		status,
		language,
		created_at,
		updated_at,
		deleted_at,
	} = actionEntry;

	return (
		<div className="space-y-6">
			<div>
				<h3 className="font-bold border-b border-line pb-2 mb-3">
					Details
				</h3>
				<div className="ml-4 space-y-1 text-sm">
					<p>
						<span className="font-semibold">ID:</span> {id}
					</p>
					<p>
						<span className="font-semibold">Name:</span> {name}
					</p>
					<p>
						<span className="font-semibold">Email:</span> {email}
					</p>
					<p>
						<span className="font-semibold">Language:</span>{' '}
						{language}
					</p>
				</div>
			</div>

			<div>
				<h3 className="font-bold border-b border-line pb-2 mb-3">
					Account Info
				</h3>
				<div className="ml-4 space-y-1 text-sm">
					<p>
						<span className="font-semibold">Role:</span> {role}
					</p>
					<p>
						<span className="font-semibold">Status:</span>{' '}
						<span
							className={
								status === UserStatusEnum.ACTIVE
									? 'text-green-600'
									: status === UserStatusEnum.INACTIVE
										? 'text-yellow-600'
										: 'text-gray-600'
							}
						>
							{status}
						</span>
					</p>
					{deleted_at && (
						<p>
							<span className="font-semibold">Deleted At:</span>{' '}
							<span className="text-red-500">
								{formatDate(deleted_at, 'date-time')}
							</span>
						</p>
					)}
				</div>
			</div>

			<div>
				<h3 className="font-bold border-b border-line pb-2 mb-3">
					Timestamps
				</h3>
				<div className="ml-4 space-y-1 text-sm">
					<p>
						<span className="font-semibold">Created At:</span>{' '}
						{formatDate(created_at, 'date-time')}
					</p>
					<p>
						<span className="font-semibold">Updated At:</span>{' '}
						{formatDate(updated_at, 'date-time')}
					</p>
				</div>
			</div>
		</div>
	);
}
