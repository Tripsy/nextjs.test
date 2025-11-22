'use client';

import { useStore } from 'zustand/react';
import { useDataTable } from '@/app/(dashboard)/_providers/data-table-provider';
import { UserDetails } from '@/app/(dashboard)/dashboard/users/user-details.component';

export function ViewUser() {
	const { modelStore } = useDataTable<'users'>();
	const actionEntry = useStore(modelStore, (state) => state.actionEntry);

	if (!actionEntry) {
		return (
			<div className="min-h-48 flex items-center justify-center">
				No entry selected.
			</div>
		);
	}

	return <UserDetails entry={actionEntry} />;
}
