'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { FormCsrf } from '@/app/_components/form/form-csrf';
import { FormElementEmail } from '@/app/_components/form/form-element.component';
import { FormError } from '@/app/_components/form/form-error.component';
import { FormPart } from '@/app/_components/form/form-part.component';
import { Icons } from '@/app/_components/icon.component';
import { useElementIds, useFormValidation, useFormValues } from '@/app/_hooks';
import {
	passwordRecoverAction,
	passwordRecoverValidate,
} from '@/app/(public)/account/password-recover/password-recover.action';
import {
	type PasswordRecoverFormFieldsType,
	PasswordRecoverState,
} from '@/app/(public)/account/password-recover/password-recover.definition';
import Routes from '@/config/routes';
import { cfg } from '@/config/settings';

export default function PasswordRecover() {
	const [state, action, pending] = useActionState(
		passwordRecoverAction,
		PasswordRecoverState,
	);

	const [formValues, setFormValues] =
		useFormValues<PasswordRecoverFormFieldsType>(state.values);

	const { errors, submitted, setSubmitted, markFieldAsTouched } =
		useFormValidation({
			formValues: formValues,
			validate: passwordRecoverValidate,
			debounceDelay: 800,
		});

	const handleChange = (
		name: string,
		value: string | boolean | number | Date,
	) => {
		setFormValues((prev) => ({ ...prev, [name]: value }));
		markFieldAsTouched(name as keyof PasswordRecoverFormFieldsType);
	};

	const elementIds = useElementIds(['email']);

	if (state?.situation === 'csrf_error') {
		return (
			<div className="form-section">
				<h1>Recover Password</h1>

				<div className="text-sm text-error">
					<Icons.Error /> {state.message}
				</div>
			</div>
		);
	}

	if (state?.situation === 'success') {
		return (
			<div className="form-section">
				<h1>Recover Password</h1>

				<div className="text-sm">
					<Icons.Success className="text-success" /> Please check your
					email and follow instructions to complete password recovery.
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

			<h1>Recover Password</h1>

			<FormPart className="text-sm text-center md:max-w-xs">
				<span>
					Restore your access and continue using your account
					securely.
				</span>
			</FormPart>

			<FormElementEmail
				id={elementIds.email}
				value={formValues.email ?? ''}
				disabled={pending}
				handleChange={handleChange}
				error={errors.email}
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
							Recover password
						</span>
					) : (
						<span className="flex items-center gap-2">
							<Icons.Go />
							Recover password
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
						Not registered yet?{' '}
					</span>
					<Link
						href={Routes.get('register')}
						className="link link-info link-hover text-sm"
					>
						Create an account
					</Link>
				</div>
			</FormPart>
		</form>
	);
}
