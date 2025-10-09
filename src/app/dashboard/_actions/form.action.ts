import {lang} from '@/config/lang';
import {DataSourceType, getDataSourceConfig} from '@/config/data-source';
import ValueError from '@/lib/exceptions/value.error';

export function getFormValues<K extends keyof DataSourceType>(
    dataSource: keyof DataSourceType,
    formData: FormData
): DataSourceType[K]['formState']['values'] {

    const getFormValuesFunction = getDataSourceConfig(dataSource, 'getFormValuesFunction');

    if (!getFormValuesFunction) {
        throw new ValueError('`getFormValuesFunction` is not defined for `' + dataSource + '`');
    }

    return getFormValuesFunction(formData);
}

export function handleValidate<K extends keyof DataSourceType>(
    dataSource: keyof DataSourceType,
    values: DataSourceType[K]['formState']['values'],
    id?: number
) {
    const validateFormFunction = getDataSourceConfig(dataSource, 'validateFormFunction');

    if (!validateFormFunction) {
        throw new ValueError('`validateFormFunction` is not defined for `' + dataSource + '`');
    }
    
    return validateFormFunction(values, id);
}

export async function formAction<K extends keyof DataSourceType>(
    state: DataSourceType[K]['formState'],
    formData: FormData
): Promise<DataSourceType[K]['formState']> {
    async function executeFetch(data: DataSourceType[K]['formState']['values'], id?: number) {
        if (id) {
            const updateFunction = getDataSourceConfig(state.dataSource, 'updateFunction');

            // Not all the models have `update` function
            if (!updateFunction) {
                throw new ValueError('`updateFunction` is not defined for `' + state.dataSource + '`');
            }

            return updateFunction(data, id);
        }

        const createFunction = getDataSourceConfig(state.dataSource, 'createFunction');

        // Not all the models have `create` function
        if (!createFunction) {
            throw new ValueError('`createFunction` is not defined for `' + state.dataSource + '`');
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
                errors: validated.error.flatten().fieldErrors
            };
        }
        
        const fetchResponse = await executeFetch(validated.data, state.id);

        return {
            ...result,
            errors: {},
            message: fetchResponse?.message || null,
            situation: fetchResponse?.success ? 'success' : 'error'
        };
    } catch (error: unknown) {
        console.error(error); // TODO

        const message = error instanceof ValueError
            ? error.message
            : lang('error.form');

        return {
            ...state,
            message: message,
            situation: 'error',
        };
    }
}