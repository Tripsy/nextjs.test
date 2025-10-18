'use client';

import type React from 'react';
import {
	cloneElement,
	isValidElement,
	useActionState,
	useCallback,
	useEffect,
} from 'react';
import { useStore } from 'zustand/react';
import { formAction } from '@/app/dashboard/_actions';
import { handleReset } from '@/app/dashboard/_components/data-table-actions.component';
import { useDataTable } from '@/app/dashboard/_providers/data-table-provider';
import { FormError } from '@/components/form/form-error.component';
import { FormPart } from '@/components/form/form-part.component';
import { getActionIcon, Icons } from '@/components/icon.component';
import {
	type DataSourceType,
	type FormManageContentType,
	getDataSourceConfig,
} from '@/config/data-source';
import { lang } from '@/config/lang';
import { useFormValidation, useFormValues } from '@/hooks';
import { useToast } from '@/providers/toast.provider';

export function FormManage({ children }: { children: React.ReactNode }) {
	const { dataSource, modelStore } = useDataTable();
	const { showToast } = useToast();

	const actionName = useStore(modelStore, (state) => state.actionName) as
		| 'create'
		| 'update';
	const actionEntry = useStore(modelStore, (state) => state.actionEntry);
	const closeOut = useStore(modelStore, (state) => state.closeOut);
	const refreshTableState = useStore(
		modelStore,
		(state) => state.refreshTableState,
	);

	const functions = getDataSourceConfig(dataSource, 'functions');
	const syncFormStateFunction = functions?.syncFormState;

	const formState = getDataSourceConfig(dataSource, 'formState');
	const initState =
		actionName === 'update' && actionEntry
			? syncFormStateFunction(formState, actionEntry)
			: formState;

	const [state, action, pending] = useActionState(
		formAction<typeof dataSource>,
		initState,
	);

	const [formValues, setFormValues] = useFormValues<
		DataSourceType[typeof dataSource]['formValues']
	>(state.values);

	const validateFormFunction = functions?.validateForm;

	const validate = useCallback(
		() => validateFormFunction(formValues, state.id),
		[formValues, state.id, validateFormFunction],
	);

	const { errors, submitted, setSubmitted, markFieldAsTouched } =
		useFormValidation<DataSourceType[typeof dataSource]['formValues']>({
			formValues: formValues,
			validate: validate,
			debounceDelay: 800,
		});

	const handleChange = (
		name: keyof DataSourceType[typeof dataSource]['formValues'],
		value: string | boolean,
	) => {
		setFormValues((prev) => ({ ...prev, [name]: value }));
		markFieldAsTouched(name);
	};

	// Handle success state
	useEffect(() => {
		if (state?.situation === 'success') {
			if (state?.result) {
				if (actionName === 'create') {
					handleReset('FormManage'); // We trigger reset instead of updating data table state
				} else {
					refreshTableState();
				}
			}

			showToast({
				severity: 'success',
				summary: 'Success',
				detail: lang(`${dataSource}.action.${actionName}.success`),
			});

			closeOut();
		}
	}, [
		state?.situation,
		showToast,
		closeOut,
		actionName,
		state?.result,
		refreshTableState,
		dataSource,
	]);

	// const FormManageContent = getFormManageContent(actionName);

	const actionLabel = lang(`${dataSource}.action.${actionName}.label`);
	const ActionButtonIcon = getActionIcon(actionName);

	const injectedChild = isValidElement(children)
		? cloneElement(children, {
				actionName,
				formValues,
				errors,
				handleChange,
				pending,
			} as FormManageContentType<typeof dataSource>)
		: children;

	return (
		<form
			action={async (formData) => {
				setSubmitted(true);
				action(formData);
			}}
			className="form-section"
		>
			{injectedChild}

			<FormPart>
				<div className="flex justify-end gap-3">
					<button
						type="submit"
						className="btn btn-info"
						disabled={
							pending ||
							(submitted && Object.keys(errors).length > 0)
						}
						aria-busy={pending}
					>
						{pending ? (
							<span className="flex items-center gap-2">
								<Icons.Loading className="w-4 h-4 animate-spin" />
								Saving...
							</span>
						) : submitted && Object.keys(errors).length > 0 ? (
							<span className="flex items-center gap-2">
								<Icons.Error className="w-4 h-4 animate-pulse" />
								{actionLabel}
							</span>
						) : (
							<span className="flex items-center gap-2">
								<ActionButtonIcon />
								{actionLabel}
							</span>
						)}
					</button>
				</div>
			</FormPart>

			{state?.situation === 'error' && state.message && (
				<FormError>
					<div>
						<Icons.Error /> {state.message}
					</div>
				</FormError>
			)}
		</form>
	);
}
