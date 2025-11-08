'use client';

import type { JSX } from 'react';
import { DataTableActions } from '@/app/dashboard/_components/data-table-actions.component';
import DataTableList from '@/app/dashboard/_components/data-table-list.component';
import { DataTableModal } from '@/app/dashboard/_components/data-table-modal.component';
import { DataTableProvider } from '@/app/dashboard/_providers/data-table-provider';
import { createModelStore } from '@/app/dashboard/_stores/model.store';
import { DataTablePermissionsFilters } from '@/app/dashboard/permissions/data-table-permissions-filters.component';
import { FormManagePermission } from '@/app/dashboard/permissions/form-manage-permission.component';
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

			<DataTableModal<'permissions'>
				modals={{
					// @ts-expect-error FormManagePermission props are injected at runtime via FormManage
					create: <FormManagePermission />,
					// @ts-expect-error FormManagePermission props are injected at runtime via FormManage
					update: <FormManagePermission />,
				}}
			/>
		</DataTableProvider>
	);
};
