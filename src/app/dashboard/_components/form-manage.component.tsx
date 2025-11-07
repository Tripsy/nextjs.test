'use client';

import type React from 'react';
import {
	cloneElement,
	isValidElement,
	useActionState,
	useCallback,
	useEffect,
	useMemo,
} from 'react';
import type { ZodError } from 'zod';
import { useStore } from 'zustand/react';
import { formAction } from '@/app/dashboard/_actions';
import { handleReset } from '@/app/dashboard/_components/data-table-actions.component';
import { useDataTable } from '@/app/dashboard/_providers/data-table-provider';
import { FormError } from '@/components/form/form-error.component';
import { FormPart } from '@/components/form/form-part.component';
import { getActionIcon, Icons } from '@/components/icon.component';
import {
	type DataSourceType,
	type FormManageType,
	type FormStateType,
	type FormValuesType,
	getDataSourceConfig,
} from '@/config/data-source';
import { useFormValidation, useFormValues } from '@/hooks';
import { useTranslation } from '@/hooks/use-translation.hook';
import ValueError from '@/lib/exceptions/value.error';
import { useToast } from '@/providers/toast.provider';

export function FormManage<K extends keyof DataSourceType>({
	children,
}: {
	children: React.ReactNode;
}) {
	const { dataSource, modelStore } = useDataTable<K>();
	const { showToast } = useToast();

	const actionName = useStore(modelStore, (state) => state.actionName);
	const actionEntry = useStore(modelStore, (state) => state.actionEntry);
	const closeOut = useStore(modelStore, (state) => state.closeOut);
	const refreshTableState = useStore(
		modelStore,
		(state) => state.refreshTableState,
	);

	if (!actionName) {
		throw new Error('actionName appears to be null');
	}

	const functions = getDataSourceConfig(dataSource, 'functions');

	// Determine syncFormState function
	if (!('syncFormState' in functions)) {
		throw new ValueError(
			`'syncFormState' function is not defined for ${dataSource}`,
		);
	}

	const syncFormStateFunction = functions.syncFormState;

	// Fighting with Typescript & Eslint
	if (!syncFormStateFunction) {
		throw new ValueError(
			`'syncFormState' function is not defined for ${dataSource}`,
		);
	}

	// Determine initial form state
	const formState = getDataSourceConfig(dataSource, 'formState');

	// Fighting with Typescript & Eslint
	if (!formState) {
		throw new ValueError(`'formState' is not defined for ${dataSource}`);
	}

	const initState =
		actionName === 'update' && actionEntry && syncFormStateFunction
			? syncFormStateFunction(formState, actionEntry)
			: formState;

	const [state, action, pending] = useActionState<FormStateType<K>, FormData>(
		async (state: FormStateType<K>, formData: FormData) =>
			formAction<K>(state, formData),
		initState as Awaited<FormStateType<K>>,
	);

	const [formValues, setFormValues] = useFormValues<FormValuesType<K>>(
		state.values as FormValuesType<K>,
	);

	// Determine validateForm function
	if (!('validateForm' in functions)) {
		throw new ValueError(
			`'validateForm' function is not defined for ${dataSource}`,
		);
	}

	const validateFormFunction = functions.validateForm;

	// Fighting with Typescript & Eslint
	if (!validateFormFunction) {
		throw new ValueError(
			`'validateForm' function is not defined for ${dataSource}`,
		);
	}

	const validate = useCallback(
		(
			values: FormValuesType<K>,
		): {
			success: boolean;
			error?: ZodError<FormValuesType<K>>;
		} => {
			return validateFormFunction(values, state.id) as {
				success: boolean;
				error?: ZodError<FormValuesType<K>>;
			};
		},
		[state.id, validateFormFunction],
	);

	const { errors, submitted, setSubmitted, markFieldAsTouched } =
		useFormValidation<FormValuesType<K>>({
			formValues,
			validate,
			debounceDelay: 800,
		});

	const handleChange = (
		name: keyof FormValuesType<K>,
		value: string | boolean | number | Date,
	) => {
		setFormValues((prev) => ({ ...prev, [name]: value }));
		markFieldAsTouched(name);
	};

	const actionLabelKey = `${dataSource}.action.${actionName}.label`;
	const successMessageKey = `${dataSource}.action.${actionName}.success`;

	const translationsKeys = useMemo(
		() => [successMessageKey, actionLabelKey],
		[actionLabelKey, successMessageKey],
	);

	const { translations } = useTranslation(translationsKeys);

	// Handle success state
	useEffect(() => {
		if (state?.situation === 'success') {
			if (state?.resultData) {
				if (actionName === 'create') {
					handleReset('FormManage'); // We trigger reset instead of updating data table state
				} else {
					refreshTableState();
				}
			}

			showToast({
				severity: 'success',
				summary: 'Success',
				detail: translations[successMessageKey],
			});

			closeOut();
		}
	}, [
		state?.situation,
		showToast,
		closeOut,
		actionName,
		state?.resultData,
		refreshTableState,
		translations,
		successMessageKey,
	]);

	const ActionButtonIcon = getActionIcon(actionName);

	const injectedChild = isValidElement(children)
		? cloneElement(children, {
				actionName,
				formValues,
				errors,
				handleChange,
				pending,
			} as unknown as FormManageType<K>)
		: children;

	return (
		<form
			key={`form-${actionName}`}
			action={action}
			onSubmit={() => setSubmitted(true)}
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
								{translations[actionLabelKey]}
							</span>
						) : (
							<span className="flex items-center gap-2">
								<ActionButtonIcon />
								{translations[actionLabelKey]}
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
