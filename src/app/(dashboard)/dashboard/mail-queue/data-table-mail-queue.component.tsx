'use client';

import type { JSX } from 'react';
import { Loading } from '@/app/_components/loading.component';
import { useMounted } from '@/app/_hooks';
import { DataTableActions } from '@/app/(dashboard)/_components/data-table-actions.component';
import DataTableList from '@/app/(dashboard)/_components/data-table-list.component';
import { DataTableModal } from '@/app/(dashboard)/_components/data-table-modal.component';
import { DataTableProvider } from '@/app/(dashboard)/_providers/data-table-provider';
import { createModelStore } from '@/app/(dashboard)/_stores/model.store';
import { DataTableMailQueueFilters } from '@/app/(dashboard)/dashboard/mail-queue/data-table-mail-queue-filters.component';
import { ViewMailQueue } from '@/app/(dashboard)/dashboard/mail-queue/view-mail-queue.component';
import {ViewTemplate} from "@/app/(dashboard)/dashboard/templates/view-template.component";

const modelStore = createModelStore('mail_queue');

export const DataTableMailQueue = (): JSX.Element => {
	const isMounted = useMounted();

	if (!isMounted) {
		return <Loading />;
	}

	return (
		<DataTableProvider
			dataSource="mail_queue"
			selectionMode="multiple"
			modelStore={modelStore}
		>
			<div className="standard-box p-4 shadow-md">
				<DataTableMailQueueFilters />
				<DataTableActions />
				<DataTableList dataKey="id" scrollHeight="400px" />
			</div>

			<DataTableModal<'mail_queue'>
				modals={{
					view: <ViewMailQueue />,
					viewTemplate: <ViewTemplate />
				}}
				modalClass={{
					view: 'max-w-3xl!',
				}}
			/>
		</DataTableProvider>
	);
};
