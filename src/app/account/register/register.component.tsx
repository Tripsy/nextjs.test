'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import React, { useActionState, useState } from 'react';
import {
	registerAction,
	registerValidate,
} from '@/app/account/register/register.action';
import {
	type RegisterFormFieldsType,
	RegisterState,
} from '@/app/account/register/register.definition';
import { FormCsrf } from '@/components/form/form-csrf';
import { FormElement } from '@/components/form/form-element.component';
import { FormElementError as RawFormElementError } from '@/components/form/form-element-error.component';
import { FormError } from '@/components/form/form-error.component';
import { FormPart } from '@/components/form/form-part.component';
import { Icons } from '@/components/icon.component';
import Routes from '@/config/routes';
import { cfg } from '@/config/settings';
import { useFormValidation, useFormValues } from '@/hooks';
import { LanguageEnum } from '@/lib/enums';
import { capitalizeFirstLetter } from '@/lib/utils/string';

const FormElementError = React.memo(RawFormElementError);

const languages = Object.values(LanguageEnum).map((language) => ({
	label: capitalizeFirstLetter(language),
	value: language,
}));

export default function Register() {
	const [state, action, pending] = useActionState(
		registerAction,
		RegisterState,
	);
	const [showPassword, setShowPassword] = useState(false);

	const [formValues, setFormValues] = useFormValues<RegisterFormFieldsType>(
		state.values,
	);

	const { errors, submitted, setSubmitted, markFieldAsTouched } =
		useFormValidation({
			formValues: formValues,
			validate: registerValidate,
			debounceDelay: 800,
		});

	const handleChange = (
		name: keyof RegisterFormFieldsType,
		value: string | boolean,
	) => {
		setFormValues((prev) => ({ ...prev, [name]: value }));
		markFieldAsTouched(name);
	};

	if (state?.situation === 'csrf_error') {
		return (
			<div className="text-error">
				<Icons.Error className="w-5 h-5" /> {state.message}
			</div>
		);
	}

	if (state?.situation === 'success') {
		return (
			<div className="form-section">
				<h1>Account Created</h1>
				<div className="text-sm">
					<p>
						We&apos;ve sent a verification email to{' '}
						<span className="font-semibold">
							{formValues.email}
						</span>
						.
					</p>
					<p>
						Please check your inbox and click the verification link
						to activate your account.
					</p>
				</div>
			</div>
		);
	}

	return (
		<form
			action={async (formData) => {
				setSubmitted(true);
				action(formData);
			}}
			className="form-section"
		>
			<FormCsrf inputName={cfg('csrf.inputName')} />

			<h1>Create Account</h1>

			<FormPart className="text-sm text-center md:max-w-xs">
				<>
					Quick access. Extra benefits. Your gateway to personalized
					experiences.
				</>
			</FormPart>

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
				<FormElement labelText="Password" labelFor="password">
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
				<FormElement labelText="Language">
					<div>
						<div className="flex flex-wrap gap-4">
							{languages.map(({ label, value }) => (
								<div
									key={value}
									className="flex items-center gap-1"
								>
									<input
										type="radio"
										id={`language-${value}`}
										name="language"
										value={value}
										className={clsx('radio', {
											'radio-error': errors.language,
											'radio-info': !errors.language,
										})}
										disabled={pending}
										checked={formValues.language === value}
										onChange={(e) =>
											handleChange(
												'language',
												e.target.value,
											)
										}
									/>
									<label
										htmlFor={`language-${value}`}
										className="text-sm font-normal cursor-pointer"
									>
										{label}
									</label>
								</div>
							))}
						</div>
						<FormElementError messages={errors.language} />
					</div>
				</FormElement>
			</FormPart>

			<FormPart>
				<FormElement className="flex-row">
					<div>
						<input
							id="terms"
							name="terms"
							type="checkbox"
							className={clsx('checkbox', {
								'checkbox-error': errors.terms,
								'checkbox-info': !errors.terms,
							})}
							disabled={pending}
							aria-invalid={!!errors.terms}
							checked={formValues.terms}
							onChange={(e) =>
								handleChange('terms', e.target.checked)
							}
						/>
						<label
							className="flex items-center font-normal"
							htmlFor="terms"
						>
							<span className="text-sm text-gray-500 dark:text-base-content">
								I agree with&nbsp;
							</span>
							<Link
								href={Routes.get('terms-and-conditions')}
								className="link link-info link-hover text-sm"
								target="_blank"
							>
								terms and conditions
							</Link>
						</label>
						<FormElementError messages={errors.terms} />
					</div>
				</FormElement>
			</FormPart>

			<FormPart>
				<button
					type="submit"
					className="btn btn-info w-full"
					disabled={
						pending || (submitted && Object.keys(errors).length > 0)
					}
					aria-busy={pending}
				>
					{pending ? (
						<span className="flex items-center gap-2">
							<Icons.Loading className="w-4 h-4 animate-spin" />
							Please wait...
						</span>
					) : submitted && Object.keys(errors).length > 0 ? (
						<span className="flex items-center gap-2">
							<Icons.Error className="w-4 h-4 animate-pulse" />
							Create account
						</span>
					) : (
						<span className="flex items-center gap-2">
							<Icons.Register />
							Create account
						</span>
					)}
				</button>
			</FormPart>

			{state?.situation === 'error' && state.message && (
				<FormError>
					<div>
						<Icons.Error /> {state.message}
					</div>
				</FormError>
			)}

			<FormPart className="text-center">
				<div>
					<span className="text-sm text-gray-500 dark:text-base-content">
						Already registered?{' '}
					</span>
					<Link
						href={Routes.get('login')}
						className="link link-info link-hover text-sm"
					>
						Sign in here
					</Link>
				</div>
			</FormPart>
		</form>
	);
}
