import clsx from 'clsx';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';
import {
	FormElement,
	FormElementEmail,
	FormElementName,
	FormElementPassword,
	FormElementPasswordConfirm,
} from '@/components/form/form-element.component';
import { FormElementError } from '@/components/form/form-element-error.component';
import { FormPart } from '@/components/form/form-part.component';
import type { FormManageType } from '@/config/data-source';
import { useElementIds } from '@/hooks/use-element-ids.hook';
import { UserRoleEnum } from '@/lib/entities/user.model';
import { LanguageEnum } from '@/lib/enums';
import { capitalizeFirstLetter } from '@/lib/utils/string';

const roles = Object.values(UserRoleEnum).map((v) => ({
	label: capitalizeFirstLetter(v),
	value: v,
}));

const languages = Object.values(LanguageEnum).map((v) => ({
	label: capitalizeFirstLetter(v),
	value: v,
}));

export function FormManageUser({
	actionName,
	formValues,
	errors,
	handleChange,
	pending,
}: FormManageType<'users'>) {
	const [showPassword, setShowPassword] = useState(false);

	const elementIds = useElementIds([
		'name',
		'email',
		'password',
		'passwordConfirm',
		'language',
		'role',
	]);

	return (
		<>
			<FormElementName
				id={elementIds.name}
				value={formValues.name ?? ''}
				disabled={pending}
				handleChange={handleChange}
				error={errors.name}
			/>

			<FormElementEmail
				id={elementIds.email}
				value={formValues.email ?? ''}
				disabled={pending}
				handleChange={handleChange}
				error={errors.email}
			/>

			<FormElementPassword
				labelText={
					actionName === 'create' ? 'New Password' : 'Password'
				}
				id={elementIds.password}
				value={formValues.password ?? ''}
				disabled={pending}
				handleChange={handleChange}
				error={errors.password}
				showPassword={showPassword}
				setShowPassword={setShowPassword}
			/>

			<FormElementPasswordConfirm
				id={elementIds.passwordConfirm}
				value={formValues.password_confirm ?? ''}
				disabled={pending}
				handleChange={handleChange}
				error={errors.password_confirm}
				showPassword={showPassword}
			/>

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
				<FormElement labelText="Role">
					<div>
						<div className="flex flex-wrap gap-4">
							{roles.map(({ label, value }) => (
								<div
									key={value}
									className="flex items-center gap-1.5"
								>
									<input
										type="radio"
										id={`${elementIds.role}-${value}`}
										name="role"
										value={value}
										className={clsx('radio', {
											'radio-error': errors.role,
											'radio-info': !errors.role,
										})}
										disabled={pending}
										checked={formValues.role === value}
										onChange={(e) =>
											handleChange('role', e.target.value)
										}
									/>
									<label
										htmlFor={`${elementIds.role}-${value}`}
										className="text-sm font-normal cursor-pointer"
									>
										{label}
									</label>
								</div>
							))}
						</div>
						<FormElementError messages={errors.role} />
					</div>
				</FormElement>
			</FormPart>
		</>
	);
}
