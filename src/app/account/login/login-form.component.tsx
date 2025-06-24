'use client';

import React, {useActionState, useEffect, useState} from 'react';
import {loginAction, loginValidate} from '@/app/account/login/login.action';
import {Icons} from '@/components/icon.component';
import clsx from 'clsx';
import Routes from '@/lib/routes';
import Link from 'next/link';
import {
    AuthTokenListType, AuthTokenType,
    defaultLoginFormState,
    LoginFormState,
    LoginFormValues
} from '@/app/account/login/login-form.definition';
import {useDebouncedEffect} from '@/app/hooks';

// Memoize FormFieldError to avoid unnecessary re-renders
import {FormFieldError as RawFormFieldError} from '@/components/form-field-error.component';
import {useRouter} from 'next/navigation';
import {formatDate} from '@/lib/utils/string';

const FormFieldError = React.memo(RawFormFieldError);

// TODO: continue implementation
function AuthTokenList({tokens}: { tokens: AuthTokenListType | undefined }) {
    const [selectedToken, setSelectedToken] = useState<AuthTokenType | null>(null);
    const [loading, setLoading] = useState(false);
    const [tokenList, setTokenList] = useState<AuthTokenListType>(tokens || []);

    const handleConfirmDestroy = async () => {
        if (!selectedToken) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`/api/auth/tokens/${selectedToken.ident}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Optionally show success toast here
                setTokenList(prev => prev.filter(token => token.ident !== selectedToken.ident));
            } else {
                console.error('Failed to delete session');
            }
        } catch (err) {
            console.error('Error deleting session', err);
        } finally {
            setLoading(false);
            setSelectedToken(null);
        }
    };

    return (
        <div className="space-y-4 mt-2">
            {tokenList.map((token: AuthTokenType) => (
                <div key={token.ident} className="p-4 border rounded shadow-sm">
                    <div className="text-sm">
                        {token.label}
                    </div>
                    <div className="text-xs mt-1">
                        Last used: {formatDate(token.used_at)}
                    </div>
                    <div
                        className="mt-2 btn btn-delete w-full"
                        onClick={() => setSelectedToken(token)}
                    >
                        Destroy Session
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
                            {selectedToken.label}
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
    );
}

export default function LoginForm() {
    const router = useRouter();

    const [state, action, pending] = useActionState(loginAction, defaultLoginFormState);
    const [showPassword, setShowPassword] = useState(false);

    const [formValues, setFormValues] = useState<LoginFormValues>(defaultLoginFormState.values);
    const [errors, setErrors] = useState<LoginFormState['errors']>({});

    const [dirtyFields, setDirtyFields] = useState<Partial<Record<keyof LoginFormValues, boolean>>>({});

    const handleChange = (fieldName: keyof LoginFormValues) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

            setFormValues(prev => ({...prev, [fieldName]: value}));
            setDirtyFields(prev => ({...prev, [fieldName]: true}));
        };

    // Debounced validation
    useDebouncedEffect(() => {
        if (Object.keys(dirtyFields).length > 0) {
            const validated = loginValidate(formValues);

            setErrors(validated.success ? {} : validated.error.flatten().fieldErrors);
            setDirtyFields({});
        }
    }, [formValues, dirtyFields], 800);

    // Initialize form values from server state
    useEffect(() => {
        if (state?.values) {
            setFormValues(state.values);
        }
    }, [state?.values]);

    // Combine server errors with local validation
    useEffect(() => {
        if (state?.errors) {
            setErrors(state.errors);
        }
    }, [state?.errors]);

    useEffect(() => {
        if (state?.situation === 'success' && router) {
            router.push(Routes.get('dashboard'));
        }
    }, [state?.situation, router]);

    return (
        <form action={action} className="form-section">
            <h1 className="mb-2">
                Sign In
            </h1>
            <div className="form-part form-description mb-6 md:max-w-xs">
                Secure login. Resume your personalized experience.
            </div>

            <div className="form-part">
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
                            onChange={handleChange('email')}
                        />
                    </div>
                    <FormFieldError messages={errors.email}/>
                </div>
            </div>

            <div className="form-part">
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
                            onChange={handleChange('password')}
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

            <button className="btn btn-submit" disabled={pending || !!Object.keys(errors).length} type="submit"
                    aria-busy={pending}>
                {pending ? (
                    <span className="flex items-center gap-2">
                      <Icons.Spinner className="w-4 h-4 animate-spin"/>
                      Please wait...
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
                    <div className="form-submit-error">
                        <Icons.Error/> {state.message}
                    </div>
                    <AuthTokenList tokens={state.body?.authValidTokens} />
                </>
            )}

            <p className="mt-4 text-center">
                <span className="text-sm text-gray-500 dark:text-base-content">Not registered yet? </span>
                <Link
                    href={Routes.get('register')}
                    className="link-blue text-sm"
                >
                    Create an account
                </Link>
            </p>
        </form>
    )
}