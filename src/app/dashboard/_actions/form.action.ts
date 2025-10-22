import {
	CreateFunctionType,
	type DataSourceType,
	FormStateType,
	getDataSourceConfig,
	UpdateFunctionType
} from '@/config/data-source';
import { lang } from '@/config/lang';
import ValueError from '@/lib/exceptions/value.error';
import {ApiError} from "@/lib/exceptions/api.error";

export function getFormValues<K extends keyof DataSourceType>(
	dataSource: K,
	formData: FormData,
): DataSourceType[K]['formValues'] {
	const functions = getDataSourceConfig(dataSource, 'functions');
	const getFormValuesFunction = functions?.getFormValues;

	if (!getFormValuesFunction) {
		throw new ValueError(
			`'getFormValues' function is not defined for ${dataSource}`,
		);
	}

	return getFormValuesFunction(formData);
}

export function handleValidate<K extends keyof DataSourceType>(
	dataSource: K,
	values: DataSourceType[K]['formValues'],
	id?: number,
) {
	const functions = getDataSourceConfig(dataSource, 'functions');
	const validateFormFunction = functions?.validateForm;

	return validateFormFunction(values, id);
}

export async function formAction<K extends keyof DataSourceType>(
	state: FormStateType<K>,
	formData: FormData,
): Promise<FormStateType<K>> {
	async function executeFetch(
		data: FormStateType<K>['values'],
		id?: number,
	) {
		const actions = getDataSourceConfig(state.dataSource, 'actions');

		if (id) {
			const updateFunction= actions?.update?.function as UpdateFunctionType<K> | undefined;

			// Not all the models have `update` function
			if (!updateFunction) {
				throw new ValueError(
					`'update' function is not defined for ${state.dataSource}`,
				);
			}

			return updateFunction(data, id);
		}

		const createFunction = actions?.create?.function as CreateFunctionType<K> | undefined;

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

		const result = {
			...state, // Spread existing state
			values, // Override with new values
		};

		if (!validated.success) {
			return {
				...result,
				situation: 'error',
				message: lang('error.validation'),
				errors: validated.error.flatten().fieldErrors as Partial<Record<keyof DataSourceType[K]['formValues'], string[]>>,
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
			error instanceof ValueError || error instanceof ApiError ? error.message : lang('error.form');

		return {
			...state,
			message: message,
			situation: 'error',
		};
	}
}
