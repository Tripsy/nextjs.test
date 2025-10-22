import clsx from 'clsx';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { FormElement } from '@/components/form/form-element.component';
import { FormElementError } from '@/components/form/form-element-error.component';
import { FormPart } from '@/components/form/form-part.component';
import { Icons } from '@/components/icon.component';
import type { FormManageContentType } from '@/config/data-source';
import { LanguageEnum } from '@/lib/enums';
import { UserRoleEnum } from '@/lib/models/user.model';
import { capitalizeFirstLetter } from '@/lib/utils/string';

const roles = Object.values(UserRoleEnum).map((role) => ({
	label: capitalizeFirstLetter(role),
	value: role,
}));

const languages = Object.values(LanguageEnum).map((language) => ({
	label: capitalizeFirstLetter(language),
	value: language,
}));

export function FormManageContentUsers({
	actionName,
	formValues,
	errors,
	handleChange,
	pending,
}: FormManageContentType<'users'>) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<>
			<FormPart>
				<FormElement labelText="Name" labelFor="name">
					<div>
						<IconField iconPosition="left">
							<InputIcon className="flex items-center">
								<Icons.User className="opacity-60" />
							</InputIcon>
							<InputText
								className="p-inputtext-sm w-full"
								id="name"
								name="name"
								placeholder="eg: John Doe"
								autoComplete={'name'}
								disabled={pending}
								invalid={!!errors.name}
								value={formValues.name ?? ''}
								onChange={(e) =>
									handleChange('name', e.target.value)
								}
							/>
						</IconField>
						<FormElementError messages={errors.name} />
					</div>
				</FormElement>
			</FormPart>

			<FormPart>
				<FormElement labelText="Email Address" labelFor="email">
					<div>
						<IconField iconPosition="left">
							<InputIcon className="flex items-center">
								<Icons.Email className="opacity-60" />
							</InputIcon>
							<InputText
								className="p-inputtext-sm w-full"
								id="email"
								name="email"
								placeholder="eg: example@domain.com"
								autoComplete={'email'}
								disabled={pending}
								invalid={!!errors.email}
								value={formValues.email ?? ''}
								onChange={(e) =>
									handleChange('email', e.target.value)
								}
							/>
						</IconField>
						<FormElementError messages={errors.email} />
					</div>
				</FormElement>
			</FormPart>

			<FormPart>
				<FormElement
					labelText={
						actionName === 'create' ? 'New Password' : 'Password'
					}
					labelFor="password"
				>
					<div>
						<div className="relative">
							<IconField iconPosition="left">
								<InputIcon className="flex items-center">
									<Icons.Password className="opacity-60" />
								</InputIcon>
								<InputText
									className="p-inputtext-sm w-full !pr-10"
									id="password"
									name="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="Password"
									autoComplete={'current-password'}
									disabled={pending}
									invalid={!!errors.password}
									value={formValues.password ?? ''}
									onChange={(e) =>
										handleChange('password', e.target.value)
									}
								/>
							</IconField>
							<button
								type="button"
								className="absolute right-3 top-3 focus:outline-none hover:opacity-100 transition-opacity"
								onClick={() => setShowPassword(!showPassword)}
								aria-label={
									showPassword
										? 'Hide password'
										: 'Show password'
								}
							>
								{showPassword ? (
									<Icons.Obscured className="opacity-60 hover:opacity-100 w-4 h-4" />
								) : (
									<Icons.Visible className="opacity-60 hover:opacity-100 w-4 h-4" />
								)}
							</button>
						</div>
						<FormElementError messages={errors.password} />
					</div>
				</FormElement>
			</FormPart>

			<FormPart>
				<FormElement
					labelText="Confirm Password"
					labelFor="password_confirm"
				>
					<div>
						<IconField iconPosition="left">
							<InputIcon className="flex items-center">
								<Icons.Password className="opacity-60" />
							</InputIcon>
							<InputText
								className="p-inputtext-sm w-full !pr-10"
								id="password_confirm"
								name="password_confirm"
								type={showPassword ? 'text' : 'password'}
								placeholder="Password confirmation"
								autoComplete={'new-password'}
								disabled={pending}
								invalid={!!errors.password_confirm}
								value={formValues.password_confirm ?? ''}
								onChange={(e) =>
									handleChange(
										'password_confirm',
										e.target.value,
									)
								}
							/>
						</IconField>
						<FormElementError messages={errors.password_confirm} />
					</div>
				</FormElement>
			</FormPart>

			<FormPart>
				<FormElement labelText="Language" labelFor="language">
					<div>
						<input type="hidden" name="language" value={formValues.language} />
						<Dropdown
							inputId="languageDropdown"
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
									className="flex items-center gap-1"
								>
									<input
										type="radio"
										id={`role-${value}`}
										name="role"
										value={value}
										className={clsx('radio', {
											'radio-error': errors.language,
											'radio-info': !errors.language,
										})}
										disabled={pending}
										checked={formValues.role === value}
										onChange={(e) =>
											handleChange('role', e.target.value)
										}
									/>
									<label
										htmlFor={`role-${value}`}
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
