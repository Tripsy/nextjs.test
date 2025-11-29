import { useState } from 'react';
import {
	FormComponentEmail,
	FormComponentName,
	FormComponentPassword,
	FormComponentRadio,
	FormComponentSelect,
} from '@/app/_components/form/form-element.component';
import { useElementIds } from '@/app/_hooks';
import type { FormManageType } from '@/config/data-source';
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
			<FormComponentName
				id={elementIds.name}
				fieldValue={formValues.name ?? ''}
				disabled={pending}
				onChange={(e) => handleChange('name', e.target.value)}
				error={errors.name}
			/>

			<FormComponentEmail
				id={elementIds.email}
				fieldValue={formValues.email ?? ''}
				disabled={pending}
				onChange={(e) => handleChange('email', e.target.value)}
				error={errors.email}
			/>

			<FormComponentPassword
				labelText={
					actionName === 'create' ? 'New Password' : 'Password'
				}
				id={elementIds.password}
				fieldName="password"
				fieldValue={formValues.password ?? ''}
				disabled={pending}
				onChange={(e) => handleChange('password', e.target.value)}
				error={errors.password}
				showPassword={showPassword}
				setShowPassword={setShowPassword}
			/>

			<FormComponentPassword
				labelText="Confirm Password"
				id={elementIds.passwordConfirm}
				fieldName="password_confirm"
				fieldValue={formValues.password_confirm ?? ''}
				placeholderText="Password confirmation"
				disabled={pending}
				onChange={(e) =>
					handleChange('password_confirm', e.target.value)
				}
				error={errors.password_confirm}
				showPassword={showPassword}
			/>

			<FormComponentSelect
				labelText="Language"
				id={elementIds.language}
				fieldName="language"
				fieldValue={formValues.language}
				options={languages}
				disabled={pending}
				onChange={(e) => handleChange('language', e.target.value)}
				error={errors.language}
			/>

			<FormComponentRadio
				labelText="Role"
				id={elementIds.role}
				fieldName="role"
				fieldValue={formValues.role}
				options={roles}
				disabled={pending}
				onChange={(e) => handleChange('role', e.target.value)}
				error={errors.role}
			/>
		</>
	);
}
