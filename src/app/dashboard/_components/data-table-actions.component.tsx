'use client';

import { useMemo } from 'react';
import { useStore } from 'zustand/react';
import { DataTableActionButton } from '@/app/dashboard/_components/data-table-action-button.component';
import { useDataTable } from '@/app/dashboard/_providers/data-table-provider';
import { getDataSourceConfig } from '@/config/data-source';
import { hasPermission } from '@/lib/models/auth.model';
import { useAuth } from '@/providers/auth.provider';
import { useToast } from '@/providers/toast.provider';

export const handleReset = (source: string) => {
	const event = new CustomEvent('filterReset', {
		detail: {
			source: source,
		},
	});

	window.dispatchEvent(event);
};

type ActionKey = 'create' | 'update' | 'delete' | string;

export function DataTableActions() {
	const { dataSource, selectionMode, modelStore } = useDataTable();
	const { auth } = useAuth();
	const { showToast } = useToast();

	const openCreate = useStore(modelStore, (state) => state.openCreate);
	const openUpdate = useStore(modelStore, (state) => state.openUpdate);
	const openAction = useStore(modelStore, (state) => state.openAction);
	const setActionEntry = useStore(
		modelStore,
		(state) => state.setActionEntry,
	);
	const selectedEntries = useStore(
		modelStore,
		(state) => state.selectedEntries,
	);

	const actions = useMemo(
		() => getDataSourceConfig(dataSource, 'actions'),
		[dataSource],
	);

	// useEffect(() => {
	// 	const handleUseAction = (event: CustomEvent<{ source: string }>) => {
	// 		console.log('Received useAction event:', event.detail);
	//
	// 		// you can trigger your custom action here:
	// 		// openAction(event.detail.source);
	//
	// 		handleClick(
	// 			actionName,
	// 			actionProps.permission,
	// 			actionProps.allowedEntries,
	// 			customCheck,
	// 		)
	// 	};
	//
	// 	// Attach listener
	// 	window.addEventListener('useAction', handleUseAction as EventListener);
	//
	// 	// Cleanup on unmount
	// 	return () => {
	// 		window.removeEventListener('useAction', handleUseAction as EventListener);
	// 	};
	// }, [openAction]);

	const allowAction = (
		permission: string,
		allowedEntries: 'free' | 'single' | 'multiple',
		entryCustomCheck?: (entry: unknown) => boolean,
	) => {
		if (allowedEntries === 'single') {
			if (selectedEntries.length !== 1) {
				return false;
			}

			if (entryCustomCheck && !entryCustomCheck(selectedEntries[0])) {
				return false;
			}
		}

		if (allowedEntries === 'multiple' && selectedEntries.length === 0) {
			return false;
		}

		return hasPermission(auth, permission);
	};

	const handleClick = (
		actionName: ActionKey,
		permission: string,
		allowedEntries: 'free' | 'single' | 'multiple',
		entryCustomCheck?: (entry: unknown) => boolean,
	) => {
		if (!allowAction(permission, allowedEntries, entryCustomCheck)) {
			showToast({
				severity: 'error',
				summary: 'Error',
				detail: 'Operation not allowed',
			});

			return;
		}

		switch (actionName) {
			case 'create':
				openCreate();
				break;
			case 'update':
				setActionEntry(selectedEntries[0]);
				openUpdate();
				break;
			default:
				if (allowedEntries === 'single') {
					setActionEntry(selectedEntries[0]);
				}

				openAction(actionName);
				break;
		}
	};

	const renderActions = (position: 'left' | 'right') => {
		if (!actions) {
			return null;
		}

		return Object.entries(actions).map(([actionName, actionProps]) => {
			if (
				selectedEntries.length === 0 &&
				actionProps.allowedEntries !== 'free'
			) {
				return null;
			}

			if (actionProps.position !== position) {
				return null;
			}

			const customCheck = actionProps.entryCustomCheck as
				| ((entry: unknown) => boolean)
				| undefined;

			if (
				!allowAction(
					actionProps.permission,
					actionProps.allowedEntries,
					customCheck,
				)
			) {
				return null;
			}

			return (
				<DataTableActionButton
					key={`button-${actionName}`}
					dataSource={dataSource}
					actionName={actionName}
					className={actionProps.button?.className}
					handleClick={() =>
						handleClick(
							actionName,
							actionProps.permission,
							actionProps.allowedEntries,
							customCheck,
						)
					}
				/>
			);
		});
	};

	return (
		<div className="flex flex-wrap gap-4 justify-between min-h-18 py-4">
			<div className="flex flex-wrap gap-4 items-center">
				{selectionMode === 'multiple' && (
					<div>{selectedEntries.length} selected</div>
				)}
				{renderActions('left')}
			</div>
			<div className="flex flex-wrap gap-4">{renderActions('right')}</div>
		</div>
	);
}
