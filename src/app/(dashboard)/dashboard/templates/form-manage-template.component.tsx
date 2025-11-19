import { Dropdown } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FormElement } from '@/app/_components/form/form-element.component';
import { FormElementError } from '@/app/_components/form/form-element-error.component';
import { FormPart } from '@/app/_components/form/form-part.component';
import { Icons } from '@/app/_components/icon.component';
import { useElementIds } from '@/app/_hooks';
import type { FormManageType } from '@/config/data-source';
import {
	TemplateLayoutEmailEnum,
	TemplateTypeEnum,
} from '@/lib/entities/template.model';
import { LanguageEnum } from '@/lib/enums';
import { getNestedError } from '@/lib/utils/form';
import { capitalizeFirstLetter, toKebabCase } from '@/lib/utils/string';

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
								onChange={(e) => {
									const value = toKebabCase(e.target.value);

									handleChange('label', value);
								}}
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
							labelFor={`${elementIds.content}-subject`}
						>
							<div>
								<InputText
									className="p-inputtext-sm w-full"
									id={`${elementIds.content}-subject`}
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
							labelFor={`${elementIds.content}-html`}
						>
							<div>
								<InputTextarea
									id={`${elementIds.content}-html`}
									name="content[html]"
									value={formValues.content.html ?? ''}
									onChange={(e) =>
										handleChange(
											'content.html',
											e.target.value ?? '',
										)
									}
									style={{ width: '100%', height: '320px' }}
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
							labelFor={`${elementIds.content}-layout`}
						>
							<div>
								<input
									type="hidden"
									name="content[layout]"
									value={formValues.content.layout}
								/>
								<Dropdown
									inputId={`${elementIds.content}-layout`}
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

			{formValues.type === TemplateTypeEnum.PAGE && (
				<>
					<FormPart>
						<FormElement
							labelText="Page - Title"
							labelFor={`${elementIds.content}-title`}
						>
							<div>
								<InputText
									className="p-inputtext-sm w-full"
									id={`${elementIds.content}-title`}
									name="content[title]"
									placeholder="eg: Terms & conditions"
									disabled={pending}
									invalid={
										!!getNestedError(
											errors,
											'content.title',
										)
									}
									value={formValues.content.title ?? ''}
									onChange={(e) =>
										handleChange(
											'content.title',
											e.target.value,
										)
									}
								/>
								<FormElementError
									messages={getNestedError(
										errors,
										'content.title',
									)}
								/>
							</div>
						</FormElement>
					</FormPart>

					<FormPart>
						<FormElement
							labelText="Page - Body"
							labelFor={`${elementIds.content}-body`}
						>
							<div>
								<InputTextarea
									id={`${elementIds.content}-body`}
									name="content[body]"
									value={formValues.content.body ?? ''}
									onChange={(e) =>
										handleChange(
											'content.body',
											e.target.value ?? '',
										)
									}
									style={{ width: '100%', height: '320px' }}
								/>
								<FormElementError
									messages={getNestedError(
										errors,
										'content.body',
									)}
								/>
							</div>
						</FormElement>
					</FormPart>

					<FormPart>
						<FormElement
							labelText="Page - Layout"
							labelFor={`${elementIds.content}-layout`}
						>
							<div>
								<input
									type="hidden"
									name="content[layout]"
									value={formValues.content.layout}
								/>
								<Dropdown
									inputId={`${elementIds.content}-layout`}
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
