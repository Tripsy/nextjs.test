'use client';

import React, {useActionState, useState} from 'react';
import {registerAction} from '@/app/account/register/register.action';
import {Icons} from '@/components/icon.component';
import clsx from 'clsx';
import Routes from '@/lib/routes';
import Link from 'next/link';

export default function RegisterForm() {
    const [state, action, pending] = useActionState(registerAction, undefined);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form action={action} className="form-section">
            <h1 className="mb-2">
                Create Account
            </h1>
            <div className="form-part form-description mb-6 md:max-w-sm">
                Quick access. Extra benefits. Your gateway to personalized experiences.
            </div>

            <div className="form-part">
                <div className="form-element">
                    <label htmlFor="name">Name</label>
                    <div className={clsx('input', { 'input-error': state?.errors?.name })}>
                        <Icons.User className="opacity-60"/>
                        <input
                            id="name"
                            name="name"
                            placeholder="eg: John Doe"
                            autoComplete={"name"}
                            disabled={pending}
                            defaultValue={state?.values?.name ?? ''}
                        />
                    </div>
                </div>
                {state?.errors?.name && (
                    <div className="form-element-error">{state.errors.name}</div>
                )}
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

            <div className="form-part flex flex-col gap-4">
                <div>
                    <div className="form-element">
                        <label htmlFor="password">Password</label>
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
                        <ul className="form-element-error">
                            {state.errors.password.map((error) => (
                                <li key={error}>- {error}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <div className="form-element">
                        <label htmlFor="password_confirm">Confirm Password</label>
                        <div className={clsx('input', {'input-error': state?.errors?.password_confirm})}>
                            <Icons.Password className="opacity-60"/>
                            <input
                                id="password_confirm"
                                name="password_confirm"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password confirmation"
                                autoComplete={"current-password"}
                                disabled={pending}
                                defaultValue={state?.values?.password_confirm ?? ''}
                            />
                        </div>
                    </div>
                    {state?.errors?.password_confirm && (
                        <div className="form-element-error">{state.errors.password_confirm}</div>
                    )}
                </div>
            </div>

            <div className="form-part">
                <div className="form-element">
                    <label>Preferred Language</label>
                    <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer font-normal">
                            <input
                                type="radio"
                                name="language"
                                value="en"
                                className="radio radio-info"
                                disabled={pending}
                                defaultChecked={state?.values?.language === 'en'}
                            />
                            <span className="text-sm">English</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer font-normal">
                            <input
                                type="radio"
                                name="language"
                                value="ro"
                                className="radio radio-info"
                                disabled={pending}
                                defaultChecked={state?.values?.language === 'ro'}
                            />
                            <span className="text-sm">Română</span>
                        </label>
                    </div>
                </div>
                {state?.errors?.language && (
                    <div className="form-element-error">{state.errors.language}</div>
                )}
            </div>

            <div className="form-part">
                <div className="form-element flex-row">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="checkbox checkbox-info"
                        disabled={pending}
                        defaultChecked={state?.values?.terms === true}
                    />
                    <label className="flex items-center font-normal" htmlFor="terms">
                        <span className="text-sm text-gray-500">I agree with&nbsp;</span>
                        <Link
                            href={Routes.get('terms-and-conditions')}
                            className="link-blue text-sm"
                        >
                            terms and conditions
                        </Link>
                    </label>
                </div>
                {state?.errors?.terms && (
                    <div className="form-element-error">{state.errors.terms}</div>
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
                      <Icons.Register/>
                      Create account
                    </span>
                )}
            </button>

            <p className="mt-4 text-center">
                <span className="text-sm text-gray-500">Already registered? </span>
                <Link
                    href={Routes.get('login')}
                    className="link-blue text-sm"
                >
                    Sign in here
                </Link>
            </p>
        </form>
    )
}