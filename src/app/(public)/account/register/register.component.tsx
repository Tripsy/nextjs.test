'use client';

import clsx from 'clsx';
import Link from 'next/link';
import React, { useActionState, useState } from 'react';
import { FormCsrf } from '@/app/_components/form/form-csrf';
import {
	FormElement,
	FormElementEmail,
	FormElementName,
	FormElementPassword,
	FormElementPasswordConfirm,
} from '@/app/_components/form/form-element.component';
import { FormElementError as RawFormElementError } from '@/app/_components/form/form-element-error.component';
import { FormError } from '@/app/_components/form/form-error.component';
import { FormPart } from '@/app/_components/form/form-part.component';
import { Icons } from '@/app/_components/icon.component';
import { useElementIds, useFormValidation, useFormValues } from '@/app/_hooks';
import {
	registerAction,
	registerValidate,
} from '@/app/(public)/account/register/register.action';
import {
	type RegisterFormFieldsType,
	RegisterState,
} from '@/app/(public)/account/register/register.definition';
import Routes from '@/config/routes';
import { cfg } from '@/config/settings';
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
		name: string,
		value: string | boolean | number | Date,
	) => {
		setFormValues((prev) => ({ ...prev, [name]: value }));
		markFieldAsTouched(name as keyof RegisterFormFieldsType);
	};

	const elementIds = useElementIds([
		'name',
		'email',
		'password',
		'passwordConfirm',
		'language',
		'terms',
	]);

	if (state?.situation === 'csrf_error') {
		return (
			<div className="text-error">
				<Icons.Error /> {state.message}
			</div>
		);
	}

	if (state?.situation === 'pending_account') {
		return (
			<div>
				<div className="text-sm text-error">
					<Icons.Error/> {state.message}
				</div>

				<div className="text-center mt-2">
					<span className="text-sm text-gray-500 dark:text-base-content">
						Have you confirmed your email? If you’ve lost the instructions, you can resend the{' '}
					</span>
					<Link
						href={Routes.get('email-confirm-send')}
						className="link link-info link-hover text-sm"
					>
						confirmation email
					</Link>
				</div>
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

				<p className="mt-2 text-center">
					<span className="text-sm text-gray-500 dark:text-base-content">
						Meanwhile you can go back to{' '}
						<Link
							href={Routes.get('home')}
							className="link link-info link-hover text-sm"
						>
							home page
						</Link>
					</span>
				</p>
			</div>
		);
	}

	return (
		<form
			action={action}
			onSubmit={() => setSubmitted(true)}
			className="form-section"
		>
			<FormCsrf inputName={cfg('csrf.inputName') as string} />

			<h1>Create Account</h1>

			<FormPart className="text-sm text-center md:max-w-xs">
				<>
					Quick access. Extra benefits. Your gateway to personalized
					experiences.
				</>
			</FormPart>

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
				<FormElement labelText="Language">
					<div>
						<div className="flex flex-wrap gap-4">
							{languages.map(({ label, value }) => (
								<div
									key={value}
									className="flex items-center gap-2"
								>
									<input
										type="radio"
										id={`${elementIds.language}-${value}`}
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
										htmlFor={`${elementIds.language}-${value}`}
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
				<FormElement>
					<div className="flex gap-2">
						<input
							id={elementIds.terms}
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
							htmlFor={elementIds.terms}
						>
							<span className="text-sm text-gray-500 dark:text-base-content">
								I agree with&nbsp;
							</span>
							<Link
								href={Routes.get('page', {
									label: 'terms-and-conditions',
								})}
								className="link link-info link-hover text-sm"
								target="_blank"
								title="Terms & Conditions"
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
							<Icons.Go />
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
