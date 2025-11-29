'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useActionState, useEffect } from 'react';
import { FormCsrf } from '@/app/_components/form/form-csrf';
import {
	FormElement,
	FormElementName,
} from '@/app/_components/form/form-element.component';
import { FormElementError as RawFormElementError } from '@/app/_components/form/form-element-error.component';
import { FormError } from '@/app/_components/form/form-error.component';
import { FormPart } from '@/app/_components/form/form-part.component';
import { Icons } from '@/app/_components/icon.component';
import { Loading } from '@/app/_components/loading.component';
import { useElementIds, useFormValidation, useFormValues } from '@/app/_hooks';
import { useAuth } from '@/app/_providers/auth.provider';
import {
	accountEditAction,
	accountEditValidate,
} from '@/app/(public)/account/edit/account-edit.action';
import {
	type AccountEditFormFieldsType,
	AccountEditState,
} from '@/app/(public)/account/edit/account-edit.definition';
import Routes from '@/config/routes';
import { cfg } from '@/config/settings';
import { LanguageEnum } from '@/lib/enums';
import { capitalizeFirstLetter } from '@/lib/utils/string';

const FormElementError = React.memo(RawFormElementError);

const languages = Object.values(LanguageEnum).map((language) => ({
	label: capitalizeFirstLetter(language),
	value: language,
}));

export default function AccountEdit() {
	const { auth, authStatus, refreshAuth } = useAuth();

	const [state, action, pending] = useActionState(
		accountEditAction,
		AccountEditState,
	);

	const [formValues, setFormValues] =
		useFormValues<AccountEditFormFieldsType>(state.values);

	useEffect(() => {
		if (authStatus === 'authenticated' && auth) {
			setFormValues({
				name: auth.name || '',
				language: auth.language || LanguageEnum.EN,
			});
		}
	}, [authStatus, auth, setFormValues]);

	const { errors, submitted, setSubmitted, markFieldAsTouched } =
		useFormValidation({
			formValues: formValues,
			validate: accountEditValidate,
			debounceDelay: 800,
		});

	const handleChange = (
		name: string,
		value: string | boolean | number | Date,
	) => {
		setFormValues((prev) => ({ ...prev, [name]: value }));
		markFieldAsTouched(name as keyof AccountEditFormFieldsType);
	};

	const router = useRouter();

	// Refresh auth & redirect to `/account/me`
	useEffect(() => {
		if (state?.situation === 'success' && router) {
			(async () => {
				await refreshAuth();
			})();

			router.replace(Routes.get('account-me'));
		}
	}, [state?.situation, router, refreshAuth]);

	const elementIds = useElementIds(['name', 'language']);

	if (authStatus === 'loading') {
		return <Loading />;
	}

	if (!auth) {
		return (
			<div>
				<h1 className="text-center">Not Authenticated</h1>
				<div className="text-sm">
					<Icons.Error className="text-error mr-1" />
					Please{' '}
					<Link
						href={Routes.get('login')}
						title="Sign in"
						className="link link-info link-hover"
					>
						{' '}
						log in{' '}
					</Link>{' '}
					to view your account.
				</div>
			</div>
		);
	}

	if (state?.situation === 'csrf_error') {
		return (
			<div className="form-section">
				<h1 className="text-center">My Account - Edit</h1>

				<div className="text-sm text-error">
					<Icons.Error /> {state.message}
				</div>
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

			<h1 className="text-center">My Account - Edit</h1>

			<FormElementName
				id={elementIds.name}
				value={formValues.name ?? ''}
				disabled={pending}
				handleChange={handleChange}
				error={errors.name}
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
							Save
						</span>
					) : (
						<span className="flex items-center gap-2">
							<Icons.Go />
							Save
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
