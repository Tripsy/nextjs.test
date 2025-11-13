'use client';

import type { JSX } from 'react';
import { DataTableActions } from '@/app/dashboard/_components/data-table-actions.component';
import DataTableList from '@/app/dashboard/_components/data-table-list.component';
import { DataTableModal } from '@/app/dashboard/_components/data-table-modal.component';
import { DataTableProvider } from '@/app/dashboard/_providers/data-table-provider';
import { createModelStore } from '@/app/dashboard/_stores/model.store';
import { DataTableTemplatesFilters } from '@/app/dashboard/templates/data-table-templates-filters.component';
import { FormManageTemplate } from '@/app/dashboard/templates/form-manage-template.component';
import { ViewTemplate } from '@/app/dashboard/templates/view-template.component';
import { Loading } from '@/components/loading.component';
import { useMounted } from '@/hooks';

const modelStore = createModelStore('templates');

export const DataTableTemplates = (): JSX.Element => {
	const isMounted = useMounted();

	if (!isMounted) {
		return <Loading />;
	}

	return (
		<DataTableProvider
			dataSource="templates"
			selectionMode="checkbox"
			modelStore={modelStore}
		>
			<div className="standard-box p-4 shadow-md">
				<DataTableTemplatesFilters />
				<DataTableActions />
				<DataTableList dataKey="id" scrollHeight="400px" />
			</div>

			<DataTableModal<'templates'>
				modals={{
					// @ts-expect-error FormManageTemplate props are injected at runtime via FormManage
					create: <FormManageTemplate />,
					// @ts-expect-error FormManageTemplate props are injected at runtime via FormManage
					update: <FormManageTemplate />,
					view: <ViewTemplate />,
				}}
				modalClass={{
					create: 'max-w-4xl!',
					update: 'max-w-4xl!',
					view: 'max-w-4xl!',
				}}
			/>
		</DataTableProvider>
	);
};
