'use client';

import type React from 'react';
import { useEffect } from 'react';
import { useStore } from 'zustand/react';
import { ActionManage } from '@/app/dashboard/_components/action-manage.component';
import { FormManage } from '@/app/dashboard/_components/form-manage.component';
import { useDataTable } from '@/app/dashboard/_providers/data-table-provider';
import { getActionIcon, Icons } from '@/components/icon.component';
import type { DataSourceType } from '@/config/data-source';
import { lang } from '@/config/lang';
import { useToast } from '@/providers/toast.provider';

export function DataTableManage<K extends keyof DataSourceType>({
	children,
}: {
	children: React.ReactNode;
}) {
	const { dataSource, modelStore } = useDataTable();
	const { showToast } = useToast();

	const isOpen = useStore(modelStore, (state) => state.isOpen);
	const actionName = useStore(modelStore, (state) => state.actionName);
	const actionEntry = useStore(modelStore, (state) => state.actionEntry);
	const closeOut = useStore(modelStore, (state) => state.closeOut);

	const isForm = actionName && ['create', 'update'].includes(actionName);

	const formComponentKey = isForm
		? actionEntry?.id
			? `update-${actionEntry.id}`
			: 'create'
		: null;
	const actionComponentKey =
		actionName && !isForm ? `action-${actionName}` : null;

	useEffect(() => {
		if (isOpen && actionName === 'update' && !actionEntry) {
			showToast({
				severity: 'error',
				summary: 'Error',
				detail: 'Please select only one entry to edit',
			});

			return;
		}
	}, [actionEntry, actionName, isOpen, showToast]);

	const handleClose = () => {
		closeOut();
	};

	if (!isOpen || !actionName) {
		return null;
	}

	const actionTitle = lang(`${dataSource}.action.${actionName}.title`);
	const ActionButtonIcon = getActionIcon(actionName);

	return (
		<div className="fixed inset-0 bg-base-300/90 flex items-center justify-center h-full z-50">
			<div className="bg-base-100 rounded-lg w-full max-w-lg relative max-h-[80vh] flex flex-col mx-4">
				<div className="flex justify-between px-6 py-3 rounded-t-lg shadow-lg">
					<h1 className="text-lg font-semibold">
						<ActionButtonIcon /> {actionTitle}
					</h1>
					<div>
						<button
							type="button"
							aria-label="Close"
							title="Close"
							onClick={handleClose}
							className="opacity-80 hover:opacity-100 transition-all duration-150 cursor-pointer"
						>
							<Icons.Action.Cancel className="text-2xl" />
						</button>
					</div>
				</div>
				<div className="bg-base-200 flex-1 overflow-y-auto p-6">
					{formComponentKey && (
						<FormManage<K> key={formComponentKey}>
							{children}
						</FormManage>
					)}
					{actionComponentKey && (
						<ActionManage key={actionComponentKey} />
					)}
				</div>
			</div>
		</div>
	);
}
