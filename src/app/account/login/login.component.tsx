'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import React, { useActionState, useEffect, useMemo, useState } from 'react';
import { loginAction, loginValidate } from '@/app/account/login/login.action';
import {
	type AuthTokenListType,
	type AuthTokenType,
	type LoginFormFieldsType,
	LoginState,
} from '@/app/account/login/login.definition';
import { FormCsrf } from '@/components/form/form-csrf';
import { FormElement } from '@/components/form/form-element.component';
import { FormElementError as RawFormElementError } from '@/components/form/form-element-error.component';
import { FormError } from '@/components/form/form-error.component';
import { FormPart } from '@/components/form/form-part.component';
import { Icons } from '@/components/icon.component';
import Routes, { isExcludedRoute } from '@/config/routes';
import { cfg } from '@/config/settings';
import { useFormValidation, useFormValues } from '@/hooks';
import { removeTokenAccount } from '@/lib/services/account.service';
import { formatDate } from '@/lib/utils/date';
import { generateElementId } from '@/lib/utils/string';
import { useAuth } from '@/providers/auth.provider';

const FormElementError = React.memo(RawFormElementError);

export default function Login() {
	const [state, action, pending] = useActionState(loginAction, LoginState);
	const [showPassword, setShowPassword] = useState(false);

	const { refreshAuth } = useAuth();

	const router = useRouter();

	const [formValues, setFormValues] = useFormValues<LoginFormFieldsType>(
		state.values,
	);

	const { errors, submitted, setSubmitted, markFieldAsTouched } =
		useFormValidation({
			formValues: formValues,
			validate: loginValidate,
			debounceDelay: 800,
		});

	const handleChange = (
		name: keyof LoginFormFieldsType,
		value: string | boolean,
	) => {
		setFormValues((prev) => ({ ...prev, [name]: value }));
		markFieldAsTouched(name);
	};

	useEffect(() => {
		if (state?.situation === 'success' && router) {
			(async () => {
				await refreshAuth();
			})();

			// Get the original destination from query params
			const fromParam = new URLSearchParams(window.location.search).get(
				'from',
			);

			let redirectUrl = Routes.get('home');

			if (fromParam) {
				const decodedFrom = decodeURIComponent(fromParam);

				// Parse the decoded URL to extract just the pathname
				const url = new URL(decodedFrom, window.location.origin);
				const pathname = url.pathname;

				// Check only the pathname against excluded routes
				if (!isExcludedRoute(pathname)) {
					redirectUrl = url.toString();
				}
			}

			router.replace(redirectUrl);
		}
	}, [state?.situation, router, refreshAuth]);

	if (state?.situation === 'csrf_error') {
		return (
			<div className="text-error">
				<Icons.Error className="w-5 h-5" /> {state.message}
			</div>
		);
	}

	return (
		<form
			action={action}
			onSubmit={() => setSubmitted(true)}
			className="form-section"
		>
			<FormCsrf inputName={cfg('csrf.inputName')} />

			<h1>Sign In</h1>

			<FormPart className="text-sm text-center md:max-w-xs">
				<span>Secure login. Resume your personalized experience.</span>
			</FormPart>

			<FormPart>
				<FormElement
					labelText="Email Address"
					labelFor={generateElementId('email')}
				>
					<div>
						<IconField iconPosition="left">
							<InputIcon className="flex items-center">
								<Icons.Email className="opacity-60" />
							</InputIcon>
							<InputText
								className="p-inputtext-sm w-full"
								id={generateElementId('email')}
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
					labelText="Password"
					labelFor={generateElementId('password')}
				>
					<div>
						<div className="relative">
							<IconField iconPosition="left">
								<InputIcon className="flex items-center">
									<Icons.Password className="opacity-60" />
								</InputIcon>
								<InputText
									className="p-inputtext-sm w-full !pr-10"
									id={generateElementId('password')}
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
							Login
						</span>
					) : (
						<span className="flex items-center gap-2">
							<Icons.Login />
							Login
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

			{state?.situation === 'max_active_sessions' && state.message && (
				<FormPart>
					<AuthTokenList
						tokens={state.body?.authValidTokens || []}
						status={{
							message: state.message,
							error: true,
						}}
					/>
				</FormPart>
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

function AuthTokenList({
	status,
	tokens,
}: {
	status: { message: string; error: boolean };
	tokens: AuthTokenListType | [];
}) {
	const [displayStatus, setDisplayStatus] = useState({ ...status });
	const [selectedToken, setSelectedToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [tokenList, setTokenList] = useState<AuthTokenListType>([
		...(tokens || []),
	]);

	useEffect(() => {
		setTokenList([...tokens]);
	}, [tokens]);

	useEffect(() => {
		setDisplayStatus(status);
	}, [status]);

	const handleConfirmDestroy = async () => {
		if (!selectedToken) {
			return;
		}

		try {
			setLoading(true);

			await removeTokenAccount(selectedToken);

			setDisplayStatus({
				message:
					'Session destroyed successfully. You can retry logging in',
				error: false,
			});

			setTokenList((prev) =>
				prev.filter((token) => token.ident !== selectedToken),
			);
		} catch {
			setDisplayStatus({
				message: 'Error deleting session',
				error: true,
			});
		} finally {
			setLoading(false);
			setSelectedToken(null);
		}
	};

	const selectedTokenData: AuthTokenType | undefined = useMemo(
		() => tokenList.find((token) => token.ident === selectedToken),
		[selectedToken, tokenList],
	);

	return (
		<>
			{displayStatus.error && displayStatus.message && (
				<FormError>
					<div>
						<Icons.Error /> {displayStatus.message}
					</div>
				</FormError>
			)}

			{!displayStatus.error && displayStatus.message && (
				<FormError className="text-info">
					<div>
						<Icons.Ok /> {displayStatus.message}
					</div>
				</FormError>
			)}

			<div className="space-y-4">
				{tokenList.map((token: AuthTokenType) => (
					<div
						key={token.ident}
						className="p-4 border border-line rounded shadow-sm"
					>
						<div className="text-sm">{token.label}</div>
						<div className="text-xs mt-1">
							Last used: {formatDate(token.used_at)}
						</div>
						<button
							type="button"
							className="mt-2 btn btn-neutral hover:text-white hover:bg-error border-none w-full"
							onClick={() => setSelectedToken(token.ident)}
						>
							<Icons.Action.Destroy /> Destroy Session
						</button>
					</div>
				))}

				{selectedToken && (
					<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
						<div className="bg-base-200 p-4 md:p-8 rounded-md shadow-xl max-w-sm w-full">
							<p className="text-sm semi-bold">
								Are you sure you want to destroy the session?
							</p>
							<p className="font-mono text-xs break-words mt-2">
								{selectedTokenData?.label}
							</p>
							<div className="flex justify-end gap-2 mt-4">
								<button
									type="button"
									className="btn btn-neutral"
									onClick={() => setSelectedToken(null)}
									disabled={loading}
								>
									Cancel
								</button>
								<button
									type="button"
									className="btn btn-success"
									onClick={handleConfirmDestroy}
									disabled={loading}
								>
									{loading ? 'Deleting...' : 'Confirm'}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
