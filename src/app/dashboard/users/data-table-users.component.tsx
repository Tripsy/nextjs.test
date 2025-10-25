'use client';

import type { JSX } from 'react';
import { DataTableActions } from '@/app/dashboard/_components/data-table-actions.component';
import DataTableList from '@/app/dashboard/_components/data-table-list.component';
import { DataTableManage } from '@/app/dashboard/_components/data-table-manage.component';
import { DataTableProvider } from '@/app/dashboard/_providers/data-table-provider';
import { createModelStore } from '@/app/dashboard/_stores/model.store';
import { DataTableUsersFilters } from '@/app/dashboard/users/data-table-users-filters.component';
import { FormUserManage } from '@/app/dashboard/users/form-user-manage.component';
import { FormUserPermissions } from '@/app/dashboard/users/form-user-permissions.component';
import { Loading } from '@/components/loading.component';
import { useMounted } from '@/hooks';

const modelStore = createModelStore('users');

export const DataTableUsers = (): JSX.Element => {
	const isMounted = useMounted();

	if (!isMounted) {
		return <Loading />;
	}

	return (
		<DataTableProvider
			dataSource="users"
			selectionMode="checkbox"
			modelStore={modelStore}
		>
			<div className="standard-box p-4 shadow-md">
				<DataTableUsersFilters />
				<DataTableActions />
				<DataTableList dataKey="id" scrollHeight="400px" />
			</div>

			<DataTableManage<'users'>
				forms={{
					// @ts-expect-error FormUserManage props are injected at runtime via FormManage
					create: <FormUserManage />,
					// @ts-expect-error FormUserManage props are injected at runtime via FormManage
					update: <FormUserManage />,
					permissions: <FormUserPermissions />,
				}}
				wrapperClass={{
					permissions: 'max-w-xl',
				}}
			/>
		</DataTableProvider>
	);
};
