'use client';

import React, {useActionState, useState} from 'react';
import {registerAction, registerValidate} from '@/app/account/register/register.action';
import {Icons} from '@/components/icon.component';
import clsx from 'clsx';
import Routes from '@/lib/routes';
import Link from 'next/link';
import {
    defaultRegisterFormState,
    RegisterFormState,
    RegisterFormValues
} from '@/app/account/register/register-form.definition';

export default function RegisterForm() {
    const [state, action, pending] = useActionState(registerAction, defaultRegisterFormState);
    const [showPassword, setShowPassword] = useState(false);

    const [formValues, setFormValues] = useState<RegisterFormValues>(
        state?.values || defaultRegisterFormState.values
    );

    const [localErrors, setLocalErrors] = useState<RegisterFormState['errors']>({});

    // Combine server errors with locally cleared errors
    const errors = {
        ...state?.errors,
        ...localErrors
    };

    const clearError = (fieldName: keyof RegisterFormValues, value: string | boolean) => {
        setFormValues(prev => ({
            ...prev,
            [fieldName]: value
        }));

        const validated = registerValidate({
            ...formValues,
            [fieldName]: value
        });

        let errors: RegisterFormState['errors'] = {};

        if (!validated.success) {
            errors = validated.error.flatten().fieldErrors;
        }

        let updatedFields: Partial<RegisterFormState['errors']> = {};

        if (['password', 'password_confirm'].includes(fieldName)) {
            updatedFields['password'] = errors['password'];
            updatedFields['password_confirm'] = errors['password_confirm'];
        } else {
            updatedFields[fieldName] = errors[fieldName];
        }

        setLocalErrors(prev => ({
            ...prev,
            ...updatedFields
        }));
    };

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
                    <div className={clsx('input', { 'input-error': errors.name })}>
                        <Icons.User className="opacity-60"/>
                        <input
                            id="name"
                            name="name"
                            placeholder="eg: John Doe"
                            autoComplete={"name"}
                            disabled={pending}
                            defaultValue={state?.values?.name ?? ''}
                            onChange={(e) => clearError('name', e.target.value)}
                        />
                    </div>
                </div>
                {errors.name && (
                    <div className="form-element-error">{errors.name}</div>
                )}
            </div>

            <div className="form-part">
                <div className="form-element">
                    <label htmlFor="email">Email Address</label>
                    <div className={clsx('input', { 'input-error': errors.email })}>
                        <Icons.Email className="opacity-60"/>
                        <input
                            id="email"
                            name="email"
                            placeholder="eg: example@domain.com"
                            autoComplete={"email"}
                            disabled={pending}
                            defaultValue={state?.values?.email ?? ''}
                            onChange={(e) => clearError('email', e.target.value)}
                        />
                    </div>
                </div>
                {errors.email && (
                    <div className="form-element-error">{errors.email}</div>
                )}
            </div>

            <div className="form-part flex flex-col gap-4">
                <div>
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
                                defaultValue={state?.values?.password ?? ''}
                                onChange={(e) => clearError('password', e.target.value)}
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
                    {errors.password && (
                        <ul className="form-element-error">
                            {errors.password.map((error) => (
                                <li key={error}>- {error}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <div className="form-element">
                        <label htmlFor="password_confirm">Confirm Password</label>
                        <div className={clsx('input', {'input-error': errors.password_confirm})}>
                            <Icons.Password className="opacity-60"/>
                            <input
                                id="password_confirm"
                                name="password_confirm"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password confirmation"
                                autoComplete={"current-password"}
                                disabled={pending}
                                defaultValue={state?.values?.password_confirm ?? ''}
                                onChange={(e) => clearError('password_confirm', e.target.value)}
                            />
                        </div>
                    </div>
                    {errors.password_confirm && (
                        <div className="form-element-error">{errors.password_confirm}</div>
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
                                onChange={() => clearError('language', 'en')}
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
                                onChange={() => clearError('language', 'ro')}
                            />
                            <span className="text-sm">Română</span>
                        </label>
                    </div>
                </div>
                {errors.language && (
                    <div className="form-element-error">{errors.language}</div>
                )}
            </div>

            <div className="form-part">
                <div className="form-element flex-row">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className={clsx('checkbox', {
                            'checkbox-error': errors.terms,
                            'checkbox-info': !errors.terms
                        })}
                        disabled={pending}
                        defaultChecked={state?.values?.terms === true}
                        onChange={(e) => clearError('terms', e.target.checked)}
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
                {errors.terms && (
                    <div className="form-element-error">{errors.terms}</div>
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
            {state?.response === 'error' && state.message && (
                <div className="form-submit-error">
                    <Icons.Error/> {state.message}
                </div>
            )}

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