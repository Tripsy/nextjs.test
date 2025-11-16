'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useMemo, useState } from 'react';
import { FormCsrf } from '@/app/_components/form/form-csrf';
import {
	FormElementEmail,
	FormElementPassword,
} from '@/app/_components/form/form-element.component';
import { FormError } from '@/app/_components/form/form-error.component';
import { FormPart } from '@/app/_components/form/form-part.component';
import { Icons } from '@/app/_components/icon.component';
import { useElementIds, useFormValidation, useFormValues } from '@/app/_hooks';
import { useAuth } from '@/app/_providers/auth.provider';
import {
	loginAction,
	loginValidate,
} from '@/app/(public)/account/login/login.action';
import {
	type AuthTokenListType,
	type AuthTokenType,
	type LoginFormFieldsType,
	LoginState,
} from '@/app/(public)/account/login/login.definition';
import Routes, { isExcludedRoute } from '@/config/routes';
import { cfg } from '@/config/settings';
import { removeTokenAccount } from '@/lib/services/account.service';
import { formatDate } from '@/lib/utils/date';

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
		name: string,
		value: string | boolean | number | Date,
	) => {
		setFormValues((prev) => ({ ...prev, [name]: value }));
		markFieldAsTouched(name as keyof LoginFormFieldsType);
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

	const elementIds = useElementIds(['email', 'password']);

	if (state?.situation === 'csrf_error') {
		return (
			<div className="text-error">
				<Icons.Error /> {state.message}
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

			<h1>Sign In</h1>

			<FormPart className="text-sm text-center md:max-w-xs">
				<span>Secure login. Resume your personalized experience.</span>
			</FormPart>

			<FormElementEmail
				id={elementIds.email}
				value={formValues.email ?? ''}
				disabled={pending}
				handleChange={handleChange}
				error={errors.email}
			/>

			<FormElementPassword
				autoComplete="current-password"
				id={elementIds.password}
				value={formValues.password ?? ''}
				disabled={pending}
				handleChange={handleChange}
				error={errors.password}
				showPassword={showPassword}
				setShowPassword={setShowPassword}
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
