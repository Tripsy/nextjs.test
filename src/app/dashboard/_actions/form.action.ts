import { type DataSourceType, getDataSourceConfig } from '@/config/data-source';
import { lang } from '@/config/lang';
import ValueError from '@/lib/exceptions/value.error';

export function getFormValues<K extends keyof DataSourceType>(
	dataSource: keyof DataSourceType,
	formData: FormData,
): DataSourceType[K]['formState']['values'] {
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
	dataSource: keyof DataSourceType,
	values: DataSourceType[K]['formState']['values'],
	id?: number,
) {
	const functions = getDataSourceConfig(dataSource, 'functions');
	const validateFormFunction = functions?.validateForm;

	return validateFormFunction(values, id);
}

export async function formAction<K extends keyof DataSourceType>(
	state: DataSourceType[K]['formState'],
	formData: FormData,
): Promise<DataSourceType[K]['formState']> {
	async function executeFetch(
		data: DataSourceType[K]['formState']['values'],
		id?: number,
	) {
		const actions = getDataSourceConfig(state.dataSource, 'actions');

		if (id) {
			const updateFunction = actions?.update?.function;

			// Not all the models have `update` function
			if (!updateFunction) {
				throw new ValueError(
					`'update' function is not defined for ${state.dataSource}`,
				);
			}

			return updateFunction(data, id);
		}

		const createFunction = actions?.create?.function;

		// Not all the models have `create` function
		if (!createFunction) {
			throw new ValueError(
				`'create' function is not defined for ${state.dataSource}`,
			);
		}

		return createFunction(data);
	}

	try {
		const values = getFormValues<K>(state.dataSource, formData);
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
				errors: validated.error.flatten().fieldErrors,
			};
		}

		const fetchResponse = await executeFetch(validated.data, state.id);

		return {
			...result,
			errors: {},
			message: fetchResponse?.message || null,
			situation: fetchResponse?.success ? 'success' : 'error',
			result: fetchResponse?.data,
		};
	} catch (error: unknown) {
		console.error(error); // TODO

		const message =
			error instanceof ValueError ? error.message : lang('error.form');

		return {
			...state,
			message: message,
			situation: 'error',
		};
	}
}
