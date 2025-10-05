'use client';

import React, {useActionState, useEffect, useMemo, useState} from 'react';
import {loginAction, loginValidate} from '@/app/account/login/login.action';
import {Icons} from '@/components/icon.component';
import clsx from 'clsx';
import Routes, {isExcludedRoute} from '@/config/routes';
import Link from 'next/link';
import {
    AuthTokenListType, AuthTokenType,
    LoginDefaultState,
    LoginFormValues
} from '@/app/account/login/login.definition';
import {useRouter} from 'next/navigation';
import {removeTokenAccount} from '@/lib/services/account.service';
import {formatDate} from '@/lib/utils/date';
import {useFormValidation, useFormValues} from '@/hooks';
import {FormFieldError as RawFormFieldError} from '@/components/form-field-error.component';
import {FormCsrf} from '@/components/form-csrf';
import {cfg} from '@/config/settings';
import {useAuth} from '@/providers/auth.provider';

const FormFieldError = React.memo(RawFormFieldError);

export default function Login() {
    const [state, action, pending] = useActionState(loginAction, LoginDefaultState);
    const [showPassword, setShowPassword] = useState(false);

    const {refreshAuth} = useAuth();

    const router = useRouter();

    const [formValues, setFormValues] = useFormValues<LoginFormValues>(
        state?.values,
        LoginDefaultState.values
    );

    const {
        errors,
        submitted,
        setSubmitted,
        markFieldAsTouched
    } = useFormValidation({
        formValues: formValues,
        validate: loginValidate,
        debounceDelay: 800,
    });

    const handleChange = (name: keyof LoginFormValues, value: string | boolean) => {
        setFormValues(prev => ({...prev, [name]: value}));
        markFieldAsTouched(name);
    };

    useEffect(() => {
        if (state?.situation === 'success' && router) {
            (async () => {
                await refreshAuth();
            })();

            // Get the original destination from query params
            const fromParam = new URLSearchParams(window.location.search).get('from');

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
                <Icons.Error className="w-5 h-5"/> {state.message}
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

            <h1 className="mb-2">
                Sign In
            </h1>
            <div className="form-spacing form-description mb-6 md:max-w-xs">
                Secure login. Resume your personalized experience.
            </div>

            <div className="form-spacing">
                <div className="form-element">
                    <label htmlFor="email">Email Address</label>
                    <div className={clsx('input', {'input-error': errors.email})}>
                        <Icons.Email className="opacity-60"/>
                        <input
                            id="email"
                            name="email"
                            placeholder="eg: example@domain.com"
                            autoComplete={"email"}
                            disabled={pending}
                            aria-invalid={!!errors.email}
                            value={formValues.email ?? ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </div>
                    <FormFieldError messages={errors.email}/>
                </div>
            </div>

            <div className="form-spacing">
                <div className="form-element">
                    <label htmlFor="password">Password</label>
                    <div className={clsx('input', {'input-error': errors.password})}>
                        <Icons.Password className="opacity-60"/>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            autoComplete={"current-password"}
                            disabled={pending}
                            aria-invalid={!!errors.password}
                            value={formValues.password ?? ''}
                            onChange={(e) => handleChange('password', e.target.value)}
                        />
                        <button
                            type="button"
                            className="focus:outline-none hover:opacity-100 transition-opacity"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <Icons.Obscured className="opacity-60 hover:opacity-100"/>
                            ) : (
                                <Icons.Visible className="opacity-60 hover:opacity-100"/>
                            )}
                        </button>
                    </div>
                    <FormFieldError messages={errors.password}/>
                </div>
            </div>

            <button
                type="submit"
                className="btn btn-info"
                disabled={pending || (submitted && Object.keys(errors).length > 0)}
                aria-busy={pending}
            >
                {pending ? (
                    <span className="flex items-center gap-2">
                        <Icons.Loading className="w-4 h-4 animate-spin"/>
                        Please wait...
                    </span>
                ) : submitted && Object.keys(errors).length > 0 ? (
                    <span className="flex items-center gap-2">
                        <Icons.Error className="w-4 h-4 animate-pulse" />
                        Fix errors
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <Icons.Login/>
                        Login
                    </span>
                )}
            </button>

            {state?.situation === 'error' && state.message && (
                <div className="form-submit-error">
                    <Icons.Error/> {state.message}
                </div>
            )}

            {state?.situation === 'max_active_sessions' && state.message && (
                <>
                    <AuthTokenList
                        tokens={state.body?.authValidTokens || []}
                        status={{
                            message: state.message,
                            error: true
                        }}
                    />
                </>
            )}

            <p className="mt-4 text-center">
                <span className="text-sm text-gray-500 dark:text-base-content">Not registered yet? </span>
                <Link
                    href={Routes.get('register')}
                    className="link link-info link-hover text-sm"
                >
                    Create an account
                </Link>
            </p>
        </form>
    )
}

function AuthTokenList({status, tokens}: {
    status: { message: string, error: boolean },
    tokens: AuthTokenListType | []
}) {
    const [displayStatus, setDisplayStatus] = useState({...status});
    const [selectedToken, setSelectedToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [tokenList, setTokenList] = useState<AuthTokenListType>([...(tokens || [])]);

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
                message: 'Session destroyed successfully. You can retry logging in',
                error: false
            });

            setTokenList(prev => prev.filter(token => token.ident !== selectedToken));
        } catch {
            setDisplayStatus({
                message: 'Error deleting session',
                error: true
            });
        } finally {
            setLoading(false);
            setSelectedToken(null);
        }
    };

    const selectedTokenData: AuthTokenType | undefined = useMemo(
        () => tokenList.find(token => token.ident === selectedToken),
        [selectedToken, tokenList]
    );

    return (
        <>
            {displayStatus.error && displayStatus.message && (
                <div className="form-submit-error">
                    <Icons.Error/> {displayStatus.message}
                </div>
            )}

            {!displayStatus.error && displayStatus.message && (
                <div className="form-submit-info">
                    <Icons.Ok/> {displayStatus.message}
                </div>
            )}

            <div className="space-y-4 mt-2">
                {tokenList.map((token: AuthTokenType) => (
                    <div key={token.ident} className="p-4 border border-line rounded shadow-sm">
                        <div className="text-sm">
                            {token.label}
                        </div>
                        <div className="text-xs mt-1">
                            Last used: {formatDate(token.used_at)}
                        </div>
                        <div
                            className="mt-2 btn btn-neutral btn-delete w-full"
                            onClick={() => setSelectedToken(token.ident)}
                        >
                            <Icons.Action.Destroy/> Destroy Session
                        </div>
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