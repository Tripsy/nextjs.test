import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { FormElement } from '@/components/form/form-element.component';
import { FormElementError } from '@/components/form/form-element-error.component';
import { FormPart } from '@/components/form/form-part.component';
import { Icons } from '@/components/icon.component';
import type { FormManageType } from '@/config/data-source';
import { useElementIds } from '@/hooks/use-element-ids.hook';
import {
	TemplateLayoutEmailEnum,
	TemplateTypeEnum,
} from '@/lib/entities/template.model';
import { LanguageEnum } from '@/lib/enums';
import { getNestedError } from '@/lib/utils/form';
import { capitalizeFirstLetter } from '@/lib/utils/string';

const languages = Object.values(LanguageEnum).map((v) => ({
	label: capitalizeFirstLetter(v),
	value: v,
}));

const types = Object.values(TemplateTypeEnum).map((v) => ({
	label: capitalizeFirstLetter(v),
	value: v,
}));

const emailLayouts = Object.values(TemplateLayoutEmailEnum).map((v) => ({
	label: capitalizeFirstLetter(v),
	value: v,
}));

export function FormManageTemplate({
	formValues,
	errors,
	handleChange,
	pending,
}: FormManageType<'templates'>) {
	const elementIds = useElementIds(['label', 'language', 'type', 'content']);

	console.log(errors);

	return (
		<>
			<FormPart>
				<FormElement labelText="Label" labelFor={elementIds.label}>
					<div>
						<IconField iconPosition="left">
							<InputIcon className="flex items-center">
								<Icons.Tag className="opacity-60" />
							</InputIcon>
							<InputText
								className="p-inputtext-sm w-full"
								id={elementIds.label}
								name="label"
								placeholder="eg: password-recover"
								disabled={pending}
								invalid={!!errors.label}
								value={formValues.label ?? ''}
								onChange={(e) =>
									handleChange('label', e.target.value)
								}
							/>
						</IconField>
						<FormElementError messages={errors.label} />
					</div>
				</FormElement>
			</FormPart>

			<div className="flex flex-wrap gap-4">
				<FormPart>
					<FormElement
						labelText="Language"
						labelFor={elementIds.language}
					>
						<div>
							<input
								type="hidden"
								name="language"
								value={formValues.language}
							/>
							<Dropdown
								inputId={elementIds.language}
								className="p-inputtext-sm"
								panelStyle={{ fontSize: '0.875rem' }}
								disabled={pending}
								value={formValues.language}
								options={languages}
								onChange={(e) =>
									handleChange('language', e.target.value)
								}
							/>
							<FormElementError messages={errors.language} />
						</div>
					</FormElement>
				</FormPart>

				<FormPart>
					<FormElement labelText="Type" labelFor={elementIds.type}>
						<div>
							<input
								type="hidden"
								name="type"
								value={formValues.type}
							/>
							<Dropdown
								inputId={elementIds.type}
								className="p-inputtext-sm"
								panelStyle={{ fontSize: '0.875rem' }}
								disabled={pending}
								value={formValues.type}
								options={types}
								onChange={(e) =>
									handleChange('type', e.target.value)
								}
							/>
							<FormElementError messages={errors.type} />
						</div>
					</FormElement>
				</FormPart>
			</div>

			{formValues.type === TemplateTypeEnum.EMAIL && (
				<>
					<FormPart>
						<FormElement
							labelText="Email - Subject"
							labelFor={`${elementIds.label}-subject`}
						>
							<div>
								<InputText
									className="p-inputtext-sm w-full"
									id={`${elementIds.label}-subject`}
									name="content[subject]"
									placeholder="eg: Recover password"
									disabled={pending}
									invalid={
										!!getNestedError(
											errors,
											'content.subject',
										)
									}
									value={formValues.content.subject ?? ''}
									onChange={(e) =>
										handleChange(
											'content.subject',
											e.target.value,
										)
									}
								/>
								<FormElementError
									messages={getNestedError(
										errors,
										'content.subject',
									)}
								/>
							</div>
						</FormElement>
					</FormPart>

					<FormPart>
						<FormElement
							labelText="Email - Content"
							labelFor={`${elementIds.label}-html`}
						>
							<div>
								<input
									type="hidden"
									name="content[html]"
									value={formValues.content.html}
								/>
								<Editor
									value={formValues.content.html}
									onTextChange={(e) =>
										handleChange(
											'content.html',
											e.htmlValue ?? '',
										)
									}
								/>
								<FormElementError
									messages={getNestedError(
										errors,
										'content.html',
									)}
								/>
							</div>
						</FormElement>
					</FormPart>

					<FormPart>
						<FormElement
							labelText="Email - Layout"
							labelFor={`${elementIds.label}-layout`}
						>
							<div>
								<input
									type="hidden"
									name="content[layout]"
									value={formValues.content.layout}
								/>
								<Dropdown
									inputId={`${elementIds.label}-layout`}
									className="p-inputtext-sm"
									panelStyle={{ fontSize: '0.875rem' }}
									disabled={pending}
									value={formValues.content.layout}
									options={emailLayouts}
									onChange={(e) =>
										handleChange(
											'content.layout',
											e.target.value,
										)
									}
								/>
								<FormElementError
									messages={getNestedError(
										errors,
										'content.layout',
									)}
								/>
							</div>
						</FormElement>
					</FormPart>
				</>
			)}
		</>
	);
}
