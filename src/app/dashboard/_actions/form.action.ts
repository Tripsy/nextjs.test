import {
	type CreateFunctionType,
	type DataSourceType,
	type FormStateType,
	type FormValuesType,
	getDataSourceConfig,
	type UpdateFunctionType,
	type ValidationReturnType,
} from '@/config/data-source';
import { lang } from '@/config/lang';
import { ApiError } from '@/lib/exceptions/api.error';
import ValueError from '@/lib/exceptions/value.error';

export function getFormValues<K extends keyof DataSourceType>(
	dataSource: K,
	formData: FormData,
): FormValuesType<K> {
	const functions = getDataSourceConfig(dataSource, 'functions');

	if (!('getFormValues' in functions)) {
		throw new ValueError(
			`'getFormValues' function is not defined for ${dataSource}`,
		);
	}

	const getFormValuesFunction = functions.getFormValues;

	// Fighting with Typescript & Eslint
	if (!getFormValuesFunction) {
		throw new ValueError(
			`'getFormValues' function is not defined for ${dataSource}`,
		);
	}

	return getFormValuesFunction(formData) as FormValuesType<K>;
}

export function handleValidate<K extends keyof DataSourceType>(
	dataSource: K,
	values: FormValuesType<K>,
	id?: number,
): ValidationReturnType<K> {
	const functions = getDataSourceConfig(dataSource, 'functions');

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

	return validateFormFunction(values, id) as ValidationReturnType<K>;
}

export async function formAction<K extends keyof DataSourceType>(
	state: FormStateType<K>,
	formData: FormData,
): Promise<FormStateType<K>> {
	async function executeFetch(data: FormStateType<K>['values'], id?: number) {
		const actions = getDataSourceConfig(state.dataSource, 'actions');

		if (id) {
			const updateFunction = actions?.update?.function as
				| UpdateFunctionType<K>
				| undefined;

			// Not all the models have `update` function
			if (!updateFunction) {
				throw new ValueError(
					`'update' function is not defined for ${state.dataSource}`,
				);
			}

			return updateFunction(data, id);
		}

		const createFunction = actions?.create?.function as
			| CreateFunctionType<K>
			| undefined;

		// Not all the models have `create` function
		if (!createFunction) {
			throw new ValueError(
				`'create' function is not defined for ${state.dataSource}`,
			);
		}

		return createFunction(data);
	}

	try {
		const values = getFormValues(state.dataSource, formData);
		const validated = handleValidate(state.dataSource, values, state.id);

		if (!validated) {
			return {
				...state,
				situation: 'error',
				message: lang('error.validation'),
			};
		}

		const result = {
			...state, // Spread existing state
			values, // Override with new values
		};

		if (!validated.success) {
			return {
				...result,
				situation: 'error',
				message: lang('error.validation'),
				errors: validated.error.flatten().fieldErrors as Partial<
					Record<keyof FormValuesType<K>, string[]>
				>,
			};
		}

		const fetchResponse = await executeFetch(validated.data, state.id);

		return {
			...result,
			errors: {},
			message: fetchResponse?.message || null,
			situation: fetchResponse?.success ? 'success' : 'error',
			resultData: fetchResponse?.data,
		};
	} catch (error: unknown) {
		// console.error(error); // TODO

		const message =
			error instanceof ValueError || error instanceof ApiError
				? error.message
				: lang('error.form');

		return {
			...state,
			message: message,
			situation: 'error',
		};
	}
}
