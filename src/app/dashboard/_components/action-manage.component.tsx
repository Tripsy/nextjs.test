'use client';

import {useDataTable} from "@/app/dashboard/_providers/data-table-provider";
import {useToast} from "@/providers/toast.provider";
import {useStore} from "zustand/react";
import {DataSourceType, getDataSourceConfig} from "@/config/data-source";
import ValueError from "@/lib/exceptions/value.error";
import {lang} from "@/config/lang";
import {DataTableActionButton} from "@/app/dashboard/_components/data-table-action-button.component";

function getActionContentEntries<K extends keyof DataSourceType>(
	dataSource: keyof DataSourceType,
	entries: DataSourceType[K]['model'][]
) {
	const functions = getDataSourceConfig(dataSource, 'functions');

	if (!functions) {
		throw new ValueError(
			`'functions' are not defined for ${dataSource}`,
		);
	}

	const getActionContentEntries = functions.getActionContentEntries;

	if (!getActionContentEntries) {
		throw new ValueError(
			`'getActionContentEntries' function is not defined for ${dataSource}`,
		);
	}

	return getActionContentEntries(entries);
}

export function ActionManage() {
	const { dataSource, modelStore } = useDataTable();
	const { showToast } = useToast();

	const isOpen = useStore(modelStore, (state) => state.isOpen);
	const actionName = useStore(modelStore, (state) => state.actionName) as string;
	const actionEntry = useStore(modelStore, (state) => state.actionEntry);
	const closeOut = useStore(modelStore, (state) => state.closeOut);
	const isLoading = useStore(modelStore, (state) => state.isLoading);
	const setLoading = useStore(modelStore, (state) => state.setLoading);
	const refreshTableState = useStore(modelStore, (state) => state.refreshTableState);
	const selectedEntries = useStore(
		modelStore,
		(state) => state.selectedEntries,
	);

	if (!isOpen || !actionName) {
		return null;
	}

	const actions = getDataSourceConfig(dataSource, 'actions');

	if (!actions) {
		throw new ValueError(
			`'actions are not defined for ${dataSource}`,
		);
	}

	const actionProps = actions[actionName];

	if (!actionProps) {
		throw new ValueError(
			`'actionProps' action props are not defined `,
		);
	}

	if (actionProps.allowedEntries === 'single' && !actionEntry) {
		throw new ValueError(
			`'actionEntry' was not provided`,
		);
	}

	async function executeFetch(
		ids: number[]
	) {
		const actionFunction = actionProps.function;

		if (!actionFunction || typeof actionFunction !== 'function') {
			throw new ValueError(
				`Function is not defined for ${actionName}`,
			);
		}

		return actionFunction(ids);
	}

	const handleClose = () => {
		closeOut();
	};

	const handleAction = async () => {
		setLoading(true);

		try {
			// When allowedEntries is 'single', actionEntry is used, otherwise selectedEntries is used to map through entries
			const ids = (actionProps.allowedEntries === 'single' ? [actionEntry as DataSourceType[typeof dataSource]['model']] : selectedEntries).map(entry => entry.id);
			const fetchResponse = await executeFetch(ids);

			refreshTableState();

			showToast({
				severity: fetchResponse?.success ? 'success' : 'error',
				summary: fetchResponse?.success ? 'Success' : 'Error',
				detail: fetchResponse?.message || lang('error.form'),
			});
		} catch (error: unknown) {
			console.error(error); // TODO

			showToast({
				severity: 'error',
				summary: 'Error',
				detail: error instanceof ValueError ? error.message : lang('error.form'),
			});
		}

		setLoading(false);
		closeOut();
	};

	const actionContentEntries = getActionContentEntries(
		dataSource,
		actionProps.allowedEntries === 'single' ? [actionEntry as DataSourceType[typeof dataSource]['model']] : selectedEntries
	);

	return (
		<>
			<p className="pb-4 font-semibold">
				{`${actionContentEntries.length} ${actionContentEntries.length === 1 ? 'entry' : 'entries'} selected`}
			</p>
			<ul className="pb-4 italic list-disc ml-4">
				{actionContentEntries.map((entry) => (
					<li key={`action-entry-${entry.id}`}>
						{entry.label} <span className="text-md">({`#${entry.id}`})</span>
					</li>
				))}
			</ul>
			<p className="pb-4 font-semibold">
				{lang(`${dataSource}.action.${actionName}.confirmText`) || `Are you sure you want to ${actionName.toLowerCase()} these entries?`}
			</p>

			<div className="flex justify-end gap-3">
				<button
					type="button"
					onClick={handleClose}
					title="Cancel"
					className="btn btn-action-cancel"
					disabled={isLoading}
				>
					Cancel
				</button>
				<DataTableActionButton
					key={`button-modal-${actionName}`}
					dataSource={dataSource}
					actionName={actionName}
					className={actionProps.button?.className}
					handleClick={handleAction}
					disabled={isLoading}
				/>
			</div>
		</>
	);
}
