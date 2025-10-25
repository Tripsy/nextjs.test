'use client';

import type { JSX } from 'react';
import { DataTableActions } from '@/app/dashboard/_components/data-table-actions.component';
import DataTableList from '@/app/dashboard/_components/data-table-list.component';
import { DataTableManage } from '@/app/dashboard/_components/data-table-manage.component';
import { DataTableProvider } from '@/app/dashboard/_providers/data-table-provider';
import { createModelStore } from '@/app/dashboard/_stores/model.store';
import { DataTablePermissionsFilters } from '@/app/dashboard/permissions/data-table-permissions-filters.component';
import { FormPermissionManage } from '@/app/dashboard/permissions/form-permission-manage.component';
import { Loading } from '@/components/loading.component';
import { useMounted } from '@/hooks';

const modelStore = createModelStore('permissions');

export const DataTablePermissions = (): JSX.Element => {
	const isMounted = useMounted();

	if (!isMounted) {
		return <Loading />;
	}

	return (
		<DataTableProvider
			dataSource="permissions"
			selectionMode="checkbox"
			modelStore={modelStore}
		>
			<div className="standard-box p-4 shadow-md">
				<DataTablePermissionsFilters />
				<DataTableActions />
				<DataTableList dataKey="id" scrollHeight="400px" />
			</div>

			<DataTableManage<'permissions'>
				forms={{
					// @ts-expect-error FormPermissionManage props are injected at runtime via FormManage
					create: <FormPermissionManage />,
					// @ts-expect-error FormPermissionManage props are injected at runtime via FormManage
					update: <FormPermissionManage />,
				}}
			/>
		</DataTableProvider>
	);
};
