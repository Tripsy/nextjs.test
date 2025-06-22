'use client';

import React, {useActionState, useState} from 'react';
import {loginAction} from '@/app/account/login/login.action';
import {Icons} from '@/components/icon.component';
import clsx from 'clsx';
import Routes from '@/lib/routes';
import Link from 'next/link';

export default function LoginForm() {
    const [state, action, pending] = useActionState(loginAction, undefined);
    const [showPassword, setShowPassword] = useState(false);

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
                    <div className={clsx('input', { 'input-error': state?.errors?.email })}>
                        <Icons.Email className="opacity-60"/>
                        <input
                            id="email"
                            name="email"
                            placeholder="eg: example@domain.com"
                            autoComplete={"email"}
                            disabled={pending}
                            defaultValue={state?.values?.email ?? ''}
                        />
                    </div>
                </div>
                {state?.errors?.email && (
                    <div className="form-element-error">{state.errors.email}</div>
                )}
            </div>

            <div className="form-part">
                <div className="form-element">
                    <div className="flex justify-between">
                        <label htmlFor="password">Password</label>
                        <Link
                            href={Routes.get('password-recover')}
                            className="link-default text-sm"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <div className={clsx('input', {'input-error': state?.errors?.password})}>
                        <Icons.Password className="opacity-60"/>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            autoComplete={"current-password"}
                            disabled={pending}
                            defaultValue={state?.values?.password ?? ''}
                        />
                        <button
                            type="button"
                            className="focus:outline-none hover:opacity-100 transition-opacity"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <Icons.Obscured className="opacity-60 hover:opacity-100" />
                            ) : (
                                <Icons.Visible className="opacity-60 hover:opacity-100" />
                            )}
                        </button>
                    </div>
                </div>
                {state?.errors?.password && (
                    <div className="form-element-error">{state.errors.password}</div>
                )}
            </div>

            <button className="btn btn-submit" disabled={pending} type="submit" aria-busy={pending}>
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

            <p className="mt-4 text-center">
                <span className="text-sm text-gray-500">Not registered yet? </span>
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