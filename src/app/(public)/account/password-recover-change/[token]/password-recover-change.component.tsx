'use client';

import Link from 'next/link';
import React, {useActionState, useState} from 'react';
import { FormCsrf } from '@/app/_components/form/form-csrf';
import {
	FormElementPassword,
	FormElementPasswordConfirm
} from '@/app/_components/form/form-element.component';
import { FormError } from '@/app/_components/form/form-error.component';
import { FormPart } from '@/app/_components/form/form-part.component';
import { Icons } from '@/app/_components/icon.component';
import { useElementIds, useFormValidation, useFormValues } from '@/app/_hooks';
import {
	passwordRecoverChangeAction,
	passwordRecoverChangeValidate,
} from '@/app/(public)/account/password-recover-change/[token]/password-recover-change.action';
import {
	type PasswordRecoverChangeFormFieldsType,
	PasswordRecoverChangeState,
} from '@/app/(public)/account/password-recover-change/[token]/password-recover-change.definition';
import Routes from '@/config/routes';
import { cfg } from '@/config/settings';
import {useParams} from "next/navigation";

export default function PasswordRecoverChange() {
	const params = useParams<{ token: string }>();

	const token = params.token;

	const [state, action, pending] = useActionState(
		passwordRecoverChangeAction,
		{
			...PasswordRecoverChangeState,
			token: token
		}
	);

	const [showPassword, setShowPassword] = useState(false);

	const [formValues, setFormValues] =
		useFormValues<PasswordRecoverChangeFormFieldsType>(state.values);

	const { errors, submitted, setSubmitted, markFieldAsTouched } =
		useFormValidation({
			formValues: formValues,
			validate: passwordRecoverChangeValidate,
			debounceDelay: 800,
		});

	const handleChange = (
		name: string,
		value: string | boolean | number | Date,
	) => {
		setFormValues((prev) => ({ ...prev, [name]: value }));
		markFieldAsTouched(name as keyof PasswordRecoverChangeFormFieldsType);
	};

	const elementIds = useElementIds(['password', 'password_confirm']);

	if (state?.situation === 'csrf_error') {
		return (
			<div className="text-error">
				<Icons.Error /> {state.message}
			</div>
		);
	}

	if (state?.situation === 'success') {
		return (
			<div className="form-section">
				<h1>Recover Password</h1>
				<div className="text-sm">
					<Icons.Success className="text-success" /> Your password has been updated successfully.
				</div>
				<p className="mt-2 text-center">
				<span className="text-sm text-gray-500 dark:text-base-content">
					You can now go to the{' '}
					<Link
						href={Routes.get('login')}
						className="link link-info link-hover text-sm"
					>
						login page
					</Link>{' '}
					and sign in with your new password.
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

			<h1>Recover Password</h1>

			<FormPart className="text-sm text-center md:max-w-xs">
				<span>Use the form below to set up a new password for your account.</span>
			</FormPart>

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
							Update password
						</span>
					) : (
						<span className="flex items-center gap-2">
							<Icons.Go />
							Update password
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
		</form>
	);
}
