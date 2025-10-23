import { Dropdown } from 'primereact/dropdown';
import { FormElement } from '@/components/form/form-element.component';
import { FormElementError } from '@/components/form/form-element-error.component';
import { FormPart } from '@/components/form/form-part.component';
import type { FormManageContentType } from '@/config/data-source';
import {
	PermissionEntitiesEnum,
	PermissionOperationEnum,
} from '@/lib/models/permission.model';
import { capitalizeFirstLetter, generateElementId } from '@/lib/utils/string';

const entities = Object.values(PermissionEntitiesEnum).map((entity) => ({
	label: capitalizeFirstLetter(entity),
	value: entity,
}));

const operations = Object.values(PermissionOperationEnum).map((operation) => ({
	label: operation,
	value: operation,
}));

export function FormManageContentPermissions({
	formValues,
	errors,
	handleChange,
	pending,
}: FormManageContentType<'permissions'>) {
	return (
		<>
			<FormPart>
				<FormElement
					labelText="Entity"
					labelFor={generateElementId('entity')}
				>
					<div>
						<input
							type="hidden"
							name="entity"
							value={formValues.entity}
						/>
						<Dropdown
							inputId={generateElementId('entity')}
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
					labelFor={generateElementId('operation')}
				>
					<div>
						<input
							type="hidden"
							name="operation"
							value={formValues.operation}
						/>
						<Dropdown
							inputId={generateElementId('operation')}
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
