import { Dropdown } from 'primereact/dropdown';
import { FormElement } from '@/components/form/form-element.component';
import { FormElementError } from '@/components/form/form-element-error.component';
import { FormPart } from '@/components/form/form-part.component';
import type { FormManageContentType } from '@/config/data-source';
import { capitalizeFirstLetter } from '@/lib/utils/string';
import {PermissionEntitiesEnum, PermissionOperationEnum} from "@/lib/models/permission.model";

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
				<FormElement labelText="Entity" labelFor="entityDropdown">
					<div>
						<input type="hidden" name="entity" value={formValues.entity} />
						<Dropdown
							inputId="entityDropdown"
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
				<FormElement labelText="Operation" labelFor="operationDropdown">
					<div>
						<input type="hidden" name="operation" value={formValues.operation} />
						<Dropdown
							inputId="operationDropdown"
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
