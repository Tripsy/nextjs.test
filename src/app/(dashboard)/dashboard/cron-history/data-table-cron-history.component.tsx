'use client';

import type { JSX } from 'react';
import { Loading } from '@/app/_components/loading.component';
import { useMounted } from '@/app/_hooks';
import { DataTableActions } from '@/app/(dashboard)/_components/data-table-actions.component';
import DataTableList from '@/app/(dashboard)/_components/data-table-list.component';
import { DataTableModal } from '@/app/(dashboard)/_components/data-table-modal.component';
import { DataTableProvider } from '@/app/(dashboard)/_providers/data-table-provider';
import { createModelStore } from '@/app/(dashboard)/_stores/model.store';
import { DataTableCronHistoryFilters } from '@/app/(dashboard)/dashboard/cron-history/data-table-cron-history-filters.component';
import { ViewCronHistory } from '@/app/(dashboard)/dashboard/cron-history/view-cron-history.component';

const modelStore = createModelStore('cron_history');

export const DataTableCronHistory = (): JSX.Element => {
	const isMounted = useMounted();

	if (!isMounted) {
		return <Loading />;
	}

	return (
		<DataTableProvider
			dataSource="cron_history"
			selectionMode="multiple"
			modelStore={modelStore}
		>
			<div className="standard-box p-4 shadow-md">
				<DataTableCronHistoryFilters />
				<DataTableActions />
				<DataTableList dataKey="id" scrollHeight="400px" />
			</div>

			<DataTableModal<'cron_history'>
				modals={{
					view: <ViewCronHistory />,
				}}
				modalClass={{
					view: 'max-w-3xl!',
				}}
			/>
		</DataTableProvider>
	);
};
