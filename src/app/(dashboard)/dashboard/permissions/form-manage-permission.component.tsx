import { Dropdown } from 'primereact/dropdown';
import { FormElement } from '@/app/_components/form/form-element.component';
import { FormElementError } from '@/app/_components/form/form-element-error.component';
import { FormPart } from '@/app/_components/form/form-part.component';
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
			<FormPart>
				<FormElement labelText="Entity" labelFor={elementIds.entity}>
					<div>
						<input
							type="hidden"
							name="entity"
							value={formValues.entity}
						/>
						<Dropdown
							inputId={elementIds.entity}
							className="p-inputtext-sm"
							panelStyle={{ fontSize: '0.875rem' }}
							disabled={pending}
							value={formValues.entity}
							options={entities}
							onChange={(e) =>
								handleChange('entity', e.target.value)
							}
						/>
						<FormElementError messages={errors.entity} />
					</div>
				</FormElement>
			</FormPart>
			<FormPart>
				<FormElement
					labelText="Operation"
					labelFor={elementIds.operation}
				>
					<div>
						<input
							type="hidden"
							name="operation"
							value={formValues.operation}
						/>
						<Dropdown
							inputId={elementIds.operation}
							className="p-inputtext-sm"
							panelStyle={{ fontSize: '0.875rem' }}
							disabled={pending}
							value={formValues.operation}
							options={operations}
							onChange={(e) =>
								handleChange('operation', e.target.value)
							}
						/>
						<FormElementError messages={errors.operation} />
					</div>
				</FormElement>
			</FormPart>
		</>
	);
}
