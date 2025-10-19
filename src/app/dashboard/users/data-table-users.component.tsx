'use client';

import type { JSX } from 'react';
import { DataTableActions } from '@/app/dashboard/_components/data-table-actions.component';
import DataTableList from '@/app/dashboard/_components/data-table-list.component';
import { DataTableManage } from '@/app/dashboard/_components/data-table-manage.component';
import { DataTableProvider } from '@/app/dashboard/_providers/data-table-provider';
import { createModelStore } from '@/app/dashboard/_stores/model.store';
import { DataTableFiltersUsers } from '@/app/dashboard/users/data-table-filters-users.component';
import { FormManageContentUsers } from '@/app/dashboard/users/form-manage-content-users.component';
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
				<DataTableFiltersUsers />
				<DataTableActions />
				<DataTableList dataKey="id" scrollHeight="400px" />
			</div>
			<DataTableManage>
				{/* @ts-expect-error FormManageContentUsers props are injected at runtime via FormManage */}
				<FormManageContentUsers />
			</DataTableManage>
		</DataTableProvider>
	);
};
