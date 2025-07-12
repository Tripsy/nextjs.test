'use client';

import React, {useActionState, useEffect, useState} from 'react';
import {registerAction, registerValidate} from '@/app/account/register/register.action';
import {Icons} from '@/components/icon.component';
import clsx from 'clsx';
import Routes from '@/config/routes';
import Link from 'next/link';
import {
    defaultRegisterState,
    RegisterState,
    RegisterFormValues
} from '@/app/account/register/register.definition';
import {FormResult} from '@/components/form-result.component';
import {useDebouncedEffect} from '@/hooks';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/providers/auth.provider';
import {lang} from '@/config/lang';
import {Loading} from '@/components/loading.component';

// Memoize FormFieldError to avoid unnecessary re-renders
import {FormFieldError as RawFormFieldError} from '@/components/form-field-error.component';

const FormFieldError = React.memo(RawFormFieldError);

export default function Register() {
    const [state, action, pending] = useActionState(registerAction, defaultRegisterState);
    const [showPassword, setShowPassword] = useState(false);

    const [formValues, setFormValues] = useState<RegisterFormValues>(defaultRegisterState.values);
    const [errors, setErrors] = useState<RegisterState['errors']>({});

    const [dirtyFields, setDirtyFields] = useState<Partial<Record<keyof RegisterFormValues, boolean>>>({});

    const router = useRouter();

    const {loadingAuth, auth} = useAuth();

    useEffect(() => {
        if (!loadingAuth && auth) {
            router.push(`${Routes.get('status', {type: 'error'})}?msg=${encodeURIComponent(lang('auth.message.already_logged_in'))}`);
        }
    }, [auth, loadingAuth, router]);

    const handleChange = (fieldName: keyof RegisterFormValues) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

            setFormValues(prev => ({...prev, [fieldName]: value}));
            setDirtyFields(prev => ({...prev, [fieldName]: true}));
        };

    // Debounced validation
    useDebouncedEffect(() => {
        if (Object.keys(dirtyFields).length > 0) {
            const validated = registerValidate(formValues);

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

    if (loadingAuth) {
        return <Loading />;
    }

    if (state?.situation === 'success') {
        return (
            <FormResult
                title="Account Created"
            >
                <div>
                    <p>We've sent a verification email to <span className="font-semibold">{formValues.email}</span>.</p>
                    <p>Please check your inbox and click the verification link to activate your account.</p>
                </div>
            </FormResult>
        );
    }

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
                            onChange={handleChange('name')}
                        />
                    </div>
                    <FormFieldError messages={errors.name}/>
                </div>
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
                                autoComplete={"new-password"}
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
                                autoComplete={"new-password"}
                                disabled={pending}
                                aria-invalid={!!errors.password_confirm}
                                value={formValues.password_confirm ?? ''}
                                onChange={handleChange('password_confirm')}
                            />
                        </div>
                        <FormFieldError messages={errors.password_confirm}/>
                    </div>
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
                                className={clsx('radio', {
                                    'radio-error': errors.language,
                                    'radio-info': !errors.language
                                })}
                                disabled={pending}
                                aria-invalid={!!errors.language}
                                checked={formValues.language === 'en'}
                                onChange={handleChange('language')}
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
                                aria-invalid={!!errors.language}
                                checked={formValues.language === 'ro'}
                                onChange={handleChange('language')}
                            />
                            <span className="text-sm">Română</span>
                        </label>
                    </div>
                    <FormFieldError messages={errors.language}/>
                </div>
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
                        aria-invalid={!!errors.terms}
                        checked={formValues.terms}
                        onChange={handleChange('terms')}
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

            <button className="btn btn-info" disabled={pending || !!Object.keys(errors).length} type="submit"
                    aria-busy={pending}>
                {pending ? (
                    <span className="flex items-center gap-2">
                      <Icons.Loading className="w-4 h-4 animate-spin"/>
                      Please wait...
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