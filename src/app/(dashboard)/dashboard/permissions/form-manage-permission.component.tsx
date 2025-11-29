import { FormComponentSelect } from '@/app/_components/form/form-element.component';
import { useElementIds } from '@/app/_hooks';
import type { FormManageType } from '@/config/data-source';
import {
	PermissionEntitiesEnum,
	PermissionOperationEnum,
} from '@/lib/entities/permission.model';
import { capitalizeFirstLetter } from '@/lib/utils/string';

const entities = Object.values(PermissionEntitiesEnum).map((v) => ({
	label: capitalizeFirstLetter(v),
	value: v,
}));

const operations = Object.values(PermissionOperationEnum).map((v) => ({
	label: v,
	value: v,
}));

export function FormManagePermission({
	formValues,
	errors,
	handleChange,
	pending,
}: FormManageType<'permissions'>) {
	const elementIds = useElementIds(['entity', 'operation']);

	return (
		<>
			<FormComponentSelect
				labelText="Entity"
				id={elementIds.entity}
				fieldName="entity"
				fieldValue={formValues.entity}
				options={entities}
				disabled={pending}
				onChange={(e) => handleChange('entity', e.target.value)}
				error={errors.entity}
			/>

			<FormComponentSelect
				labelText="Operation"
				id={elementIds.operation}
				fieldName="operation"
				fieldValue={formValues.operation}
				options={operations}
				disabled={pending}
				onChange={(e) => handleChange('operation', e.target.value)}
				error={errors.operation}
			/>
		</>
	);
}
