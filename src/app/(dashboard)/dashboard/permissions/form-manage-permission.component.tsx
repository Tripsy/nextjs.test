import { FormComponentAutoComplete } from '@/app/_components/form/form-element.component';
import { useElementIds } from '@/app/_hooks';
import { useAutocomplete } from '@/app/_hooks/use-autocomplete';
import type { FormManageType } from '@/config/data-source';
import {
	PermissionEntitiesSuggestions,
	PermissionOperationSuggestions,
} from '@/lib/entities/permission.model';

export function FormManagePermission({
	formValues,
	errors,
	handleChange,
	pending,
}: FormManageType<'permissions'>) {
	const entityAutocomplete = useAutocomplete(PermissionEntitiesSuggestions, {
		filterMode: 'includes',
		caseSensitive: false,
	});

	const operationAutocomplete = useAutocomplete(
		PermissionOperationSuggestions,
		{
			filterMode: 'includes',
			caseSensitive: false,
		},
	);

	const elementIds = useElementIds(['entity', 'operation']);

	return (
		<>
			<FormComponentAutoComplete
				labelText="Entity"
				id={elementIds.entity}
				fieldName="entity"
				fieldValue={formValues.entity}
				disabled={pending}
				onChange={(e) => handleChange('entity', e.target.value)}
				error={errors.entity}
				suggestions={entityAutocomplete.suggestions}
				completeMethod={entityAutocomplete.completeMethod}
			/>

			<FormComponentAutoComplete
				labelText="Operation"
				id={elementIds.operation}
				fieldName="operation"
				fieldValue={formValues.operation}
				disabled={pending}
				onChange={(e) => handleChange('operation', e.target.value)}
				error={errors.operation}
				suggestions={operationAutocomplete.suggestions}
				completeMethod={operationAutocomplete.completeMethod}
			/>
		</>
	);
}
