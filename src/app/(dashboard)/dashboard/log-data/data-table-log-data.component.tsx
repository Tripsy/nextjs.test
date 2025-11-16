'use client';

import type { JSX } from 'react';
import { DataTableActions } from '@/app/dashboard/_components/data-table-actions.component';
import DataTableList from '@/app/dashboard/_components/data-table-list.component';
import { DataTableModal } from '@/app/dashboard/_components/data-table-modal.component';
import { DataTableProvider } from '@/app/dashboard/_providers/data-table-provider';
import { createModelStore } from '@/app/dashboard/_stores/model.store';
import { DataTableLogDataFilters } from '@/app/dashboard/log-data/data-table-log-data-filters.component';
import { ViewLogData } from '@/app/dashboard/log-data/view-log-data.component';
import { Loading } from '@/components/loading.component';
import { useMounted } from '@/hooks';

const modelStore = createModelStore('log_data');

export const DataTableLogData = (): JSX.Element => {
	const isMounted = useMounted();

	if (!isMounted) {
		return <Loading />;
	}

	return (
		<DataTableProvider
			dataSource="log_data"
			selectionMode="multiple"
			modelStore={modelStore}
		>
			<div className="standard-box p-4 shadow-md">
				<DataTableLogDataFilters />
				<DataTableActions />
				<DataTableList dataKey="id" scrollHeight="400px" />
			</div>

			<DataTableModal<'log_data'>
				modals={{
					view: <ViewLogData />,
				}}
				modalClass={{
					view: 'max-w-3xl!',
				}}
			/>
		</DataTableProvider>
	);
};
