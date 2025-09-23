'use client';

import React, {useActionState, useState} from 'react';
import {registerAction, registerValidate} from '@/app/account/register/register.action';
import {Icons} from '@/components/icon.component';
import clsx from 'clsx';
import Routes from '@/config/routes';
import Link from 'next/link';
import {
    RegisterDefaultState,
    RegisterFormValues
} from '@/app/account/register/register.definition';
import {FormResult} from '@/components/form-result.component';
import {useFormValidation, useFormValues} from '@/hooks';
import {FormFieldError as RawFormFieldError} from '@/components/form-field-error.component';
import {PageComponentPropsType} from '@/types/page-component.type';

const FormFieldError = React.memo(RawFormFieldError);

export default function Register({csrfInput}: PageComponentPropsType) {
    const [state, action, pending] = useActionState(registerAction, RegisterDefaultState);
    const [showPassword, setShowPassword] = useState(false);

    const [formValues, setFormValues] = useFormValues<RegisterFormValues>(
        state?.values,
        RegisterDefaultState.values
    );

    const {
        errors,
        submitted,
        setSubmitted,
        markFieldAsTouched
    } = useFormValidation({
        values: formValues,
        validate: registerValidate,
        debounceDelay: 800,
    });

    const handleChange = (name: keyof RegisterFormValues, value: string | boolean) => {
        setFormValues(prev => ({...prev, [name]: value}));
        markFieldAsTouched(name);
    };

    // useLocationReload(state?.situation === 'csrf_error');

    if (state?.situation === 'success') {
        return (
            <FormResult
                title="Account Created"
            >
                <div>
                    <p>We&apos;ve sent a verification email to <span className="font-semibold">{formValues.email}</span>.</p>
                    <p>Please check your inbox and click the verification link to activate your account.</p>
                </div>
            </FormResult>
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
            {csrfInput}
            <h1 className="mb-2">
                Create Account
            </h1>

            <div className="form-description mb-6 md:max-w-sm">
                Quick access. Extra benefits. Your gateway to personalized experiences.
            </div>

            <div className="form-spacing">
                <div className="form-element">
                    <label htmlFor="name">Name</label>
                    <div className={clsx('input', {'input-error': errors.name})}>
                        <Icons.User className="opacity-60"/>
                        <input
                            id="name"
                            name="name"
                            placeholder="eg: John Doe"
                            autoComplete={"name"}
                            disabled={pending}
                            aria-invalid={!!errors.name}
                            value={formValues.name ?? ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </div>
                    <FormFieldError messages={errors.name}/>
                </div>
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
                            autoComplete={"new-password"}
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

            <div className="form-spacing">
                <div className="form-element">
                    <label htmlFor="password_confirm">Confirm Password</label>
                    <div className={clsx('input', {'input-error': errors.password_confirm})}>
                        <Icons.Password className="opacity-60"/>
                        <input
                            id="password_confirm"
                            name="password_confirm"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password confirmation"
                            autoComplete={"new-password"}
                            disabled={pending}
                            aria-invalid={!!errors.password_confirm}
                            value={formValues.password_confirm ?? ''}
                            onChange={(e) => handleChange('password_confirm', e.target.value)}
                        />
                    </div>
                    <FormFieldError messages={errors.password_confirm}/>
                </div>
            </div>

            <div className="form-spacing">
                <div className="form-element">
                    <label>Preferred Language</label>
                    <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer font-normal">
                            <input
                                type="radio"
                                name="language"
                                value="en"
                                className={clsx('radio', {
                                    'radio-error': errors.language,
                                    'radio-info': !errors.language
                                })}
                                disabled={pending}
                                checked={formValues.language === 'en'}
                                onChange={(e) => handleChange('language', e.target.value)}
                            />
                            <span className="text-sm">English</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer font-normal">
                            <input
                                type="radio"
                                name="language"
                                value="ro"
                                className={clsx('radio', {
                                    'radio-error': errors.language,
                                    'radio-info': !errors.language
                                })}
                                disabled={pending}
                                checked={formValues.language === 'ro'}
                                onChange={(e) => handleChange('language', e.target.value)}
                            />
                            <span className="text-sm">Română</span>
                        </label>
                    </div>
                    <FormFieldError messages={errors.language}/>
                </div>
            </div>

            <div className="form-spacing">
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
                        aria-invalid={!!errors.terms}
                        checked={formValues.terms}
                        onChange={(e) => handleChange('terms', e.target.checked)}
                    />
                    <label className="flex items-center font-normal" htmlFor="terms">
                        <span className="text-sm text-gray-500 dark:text-base-content">
                            I agree with&nbsp;
                        </span>
                        <Link
                            href={Routes.get('terms-and-conditions')}
                            className="link link-info link-hover text-sm"
                            target="_blank"
                        >
                            terms and conditions
                        </Link>
                    </label>
                    <FormFieldError messages={errors.terms}/>
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
                      <Icons.Register/>
                      Create account
                    </span>
                )}
            </button>

            {state?.situation === 'error' && state.message && (
                <div className="form-submit-error">
                    <Icons.Error/> {state.message}
                </div>
            )}

            <p className="mt-4 text-center">
                <span className="text-sm text-gray-500 dark:text-base-content">Already registered? </span>
                <Link
                    href={Routes.get('login')}
                    className="link link-info link-hover text-sm"
                >
                    Sign in here
                </Link>
            </p>
        </form>
    )
}