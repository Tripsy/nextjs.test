'use client';

import React, {useActionState, useCallback, useEffect, useMemo, useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {IconField} from 'primereact/iconfield';
import {InputIcon} from 'primereact/inputicon';
import {Icons} from '@/components/icon.component';
import {FormPart} from '@/components/form/form-part.component';
import {FormElement} from '@/components/form/form-element.component';
import {FormElementError} from '@/components/form/form-element-error.component';
import {useFormValidation, useFormValues} from '@/hooks';
import clsx from 'clsx';
import {Dropdown} from 'primereact/dropdown';
import {UserRoleEnum} from '@/lib/models/user.model';
import {capitalizeFirstLetter} from '@/lib/utils/string';
import {LanguageEnum} from '@/lib/enums';
import {FormStateUsers, FormFieldsUsersType, validateFormUsers} from '@/app/dashboard/users/users.definition';
import {formAction} from '@/app/dashboard/_actions';
import {useDataTable} from '@/app/dashboard/_providers/data-table-provider';
import {useStore} from 'zustand/react';
import {useToast} from '@/providers/toast.provider';

const roles = Object.values(UserRoleEnum).map((role) => ({
    label: capitalizeFirstLetter(role),
    value: role,
}));

const languages = Object.values(LanguageEnum).map((language) => ({
    label: capitalizeFirstLetter(language),
    value: language,
}));

export function FormManageUsers() {
    // const {selectedEntries, manageStore} = useDataTable();
    const {manageStore} = useDataTable();

    const isOpen = false;

    useEffect(() => {
        console.log('FormManageUsers render');
    });

    // const isCreateOpen = useStore(manageStore, (state) => state.isCreateOpen);
    // const isUpdateOpen = useStore(manageStore, (state) => state.isUpdateOpen);
    // const entries = useStore(manageStore, (state) => state.entries);
    // const close = useStore(manageStore, (state) => state.close);

    // const entry = useUserStore(state => state.entry);
    // const isLoading = useUserStore(state => state.isLoading);
    // const addUser = useUserStore(state => state.addItem);
    // const updateUser = useUserStore(state => state.updateItem);
    // const close = useUserStore(state => state.closeAllDialogs);

    // const isOpen = isCreateOpen || isUpdateOpen;
    // const isEdit = isUpdateOpen;
    // // const isError = useMemo(() => isEdit && entries.length !== 1, [isEdit, entries]);
    //
    // // let formState = FormStateUsers;
    // //
    // // // console.log(isError);
    // console.log(entries);
    //
    // if (isEdit && entries.length == 1) {
    //     formState = {
    //         ...formState,
    //         values: entries[0],
    //     }
    // }

    const [state, action, pending] = useActionState(formAction<'users'>, FormStateUsers);
    const [showPassword, setShowPassword] = useState(false);

    const [formValues, setFormValues] = useFormValues<FormFieldsUsersType>(state.values);

    // const {showToast} = useToast();

    // useEffect(() => {
    //     if (isError) {
    //         showToast({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: 'Please select only one entry to edit',
    //         });
    //         return;
    //     }
    // }, [isError, showToast]);

    const validate = useCallback(
        () => validateFormUsers(formValues, state.id),
        [formValues, state.id]
    );

    const {
        errors,
        submitted,
        setSubmitted,
        markFieldAsTouched
    } = useFormValidation<FormFieldsUsersType>({
        formValues: formValues,
        validate: validate,
        debounceDelay: 800,
    });

    const handleChange = (name: keyof FormFieldsUsersType, value: string | boolean) => {
        setFormValues(prev => ({...prev, [name]: value}));
        markFieldAsTouched(name);
    };

    // // Initialize form data based on whether we're editing or adding
    // const [formData, setFormData] = useState(initialFormData);

    // // Reset form when dialog opens/closes or editing item changes
    // useEffect(() => {
    //     if (isOpen) {
    //         if (isEdit && entry) {
    //             // Populate form with editing item data
    //             setFormData({
    //                 name: entry.name || '',
    //                 email: entry.email || '',
    //                 role: entry.role || '',
    //                 status: entry.status || 'active',
    //             });
    //         } else {
    //             // Reset to initial state for new item
    //             setFormData(initialFormData);
    //         }
    //     }
    // }, [isOpen, isEdit, entry]); // Only reset when these change

    const handleClose = () => {
        close();
    };

    if (!isOpen || isError) {
        return null;
    }

    if (state?.situation === 'success') {
        // TODO: show success message
        return (
            <div className="form-section">
                <h1>
                    Account Created
                </h1>
                <div className="mt-4 text-sm">
                    <p>We&apos;ve sent a verification email to <span className="font-semibold">{formValues.email}</span>.
                    </p>
                    <p>Please check your inbox and click the verification link to activate your account.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-base-300/90 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-lg p-6 w-full max-w-lg relative">
                <button
                    type="button"
                    aria-label="Close"
                    title="Close"
                    onClick={handleClose}
                    className="bg-base-100 opacity-80 hover:opacity-100 hover:scale-120 transition-all duration-150 cursor-pointer border border-base-200 px-2 py-1 rounded-full shadow-md text-xl absolute -top-3 -right-3"
                >
                    <Icons.Action.Cancel/>
                </button>
                <form
                    action={async (formData) => {
                        setSubmitted(true);
                        action(formData);
                    }}
                    className="form-section"
                >
                    <h1>
                        {isEdit ? 'Edit User' : 'Add New User'}
                    </h1>

                    <FormPart>
                        <FormElement labelText="Name" labelFor="name">
                            <>
                                <IconField iconPosition="left">
                                    <InputIcon className="flex items-center">
                                        <Icons.User className="opacity-60"/>
                                    </InputIcon>
                                    <InputText
                                        className="p-inputtext-sm w-full"
                                        id="name"
                                        name="name"
                                        placeholder="eg: John Doe"
                                        autoComplete={"name"}
                                        disabled={pending}
                                        invalid={!!errors.name}
                                        value={formValues.name ?? ''}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                    />
                                </IconField>
                                <FormElementError messages={errors.name}/>
                            </>
                        </FormElement>
                    </FormPart>

                    <FormPart>
                        <FormElement labelText="Email Address" labelFor="email">
                            <>
                                <IconField iconPosition="left">
                                    <InputIcon className="flex items-center">
                                        <Icons.Email className="opacity-60"/>
                                    </InputIcon>
                                    <InputText
                                        className="p-inputtext-sm w-full"
                                        id="email"
                                        name="email"
                                        placeholder="eg: example@domain.com"
                                        autoComplete={"email"}
                                        disabled={pending}
                                        invalid={!!errors.email}
                                        value={formValues.email ?? ''}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                    />
                                </IconField>
                                <FormElementError messages={errors.email}/>
                            </>
                        </FormElement>
                    </FormPart>

                    <FormPart>
                        <FormElement labelText="Password" labelFor="password">
                            <>
                                <div className="relative">
                                    <IconField iconPosition="left">
                                        <InputIcon className="flex items-center">
                                            <Icons.Password className="opacity-60"/>
                                        </InputIcon>
                                        <InputText
                                            className="p-inputtext-sm w-full !pr-10"
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            autoComplete={"current-password"}
                                            disabled={pending}
                                            invalid={!!errors.password}
                                            value={formValues.password ?? ''}
                                            onChange={(e) => handleChange('password', e.target.value)}
                                        />
                                    </IconField>
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3 focus:outline-none hover:opacity-100 transition-opacity"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <Icons.Obscured className="opacity-60 hover:opacity-100 w-4 h-4"/>
                                        ) : (
                                            <Icons.Visible className="opacity-60 hover:opacity-100 w-4 h-4"/>
                                        )}
                                    </button>
                                </div>
                                <FormElementError messages={errors.password}/>
                            </>
                        </FormElement>
                    </FormPart>

                    <FormPart>
                        <FormElement labelText="Confirm Password" labelFor="password_confirm">
                            <>
                                <IconField iconPosition="left">
                                    <InputIcon className="flex items-center">
                                        <Icons.Password className="opacity-60"/>
                                    </InputIcon>
                                    <InputText
                                        className="p-inputtext-sm w-full !pr-10"
                                        id="password_confirm"
                                        name="password_confirm"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password confirmation"
                                        autoComplete={"new-password"}
                                        disabled={pending}
                                        invalid={!!errors.password_confirm}
                                        value={formValues.password_confirm ?? ''}
                                        onChange={(e) => handleChange('password_confirm', e.target.value)}
                                    />
                                </IconField>
                                <FormElementError messages={errors.password_confirm}/>
                            </>
                        </FormElement>
                    </FormPart>

                    <FormPart>
                        <FormElement labelText="Language" labelFor="language">
                            <>
                                <Dropdown
                                    className="p-inputtext-sm"
                                    panelStyle={{fontSize: '0.875rem'}}
                                    id="language"
                                    value={formValues.language ?? LanguageEnum.EN}
                                    options={languages}
                                    onChange={(e) => handleChange('role', e.target.value)}
                                />
                                <FormElementError messages={errors.language}/>
                            </>
                        </FormElement>
                    </FormPart>

                    <FormPart>
                        <FormElement labelText="Role">
                            <>
                                <div className="flex flex-wrap gap-4">
                                    {roles.map(({label, value}) => (
                                        <div key={value} className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                id={`role-${value}`}
                                                name="role"
                                                value={value}
                                                className={clsx('radio', {
                                                    'radio-error': errors.language,
                                                    'radio-info': !errors.language
                                                })}
                                                disabled={pending}
                                                checked={formValues.role === value}
                                                onChange={(e) => handleChange('role', e.target.value)}
                                            />
                                            <label
                                                htmlFor={`role-${value}`}
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                {label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <FormElementError messages={errors.role}/>
                            </>
                        </FormElement>
                    </FormPart>

                    <FormPart>
                        <div className="flex justify-end gap-3">
                            <button
                                type="submit"
                                className="btn btn-info"
                                disabled={pending || (submitted && Object.keys(errors).length > 0)}
                                aria-busy={pending}
                            >
                                {pending ? (
                                    <span className="flex items-center gap-2">
                                        <Icons.Loading className="w-4 h-4 animate-spin"/>
                                        Saving...
                                    </span>
                                ) : submitted && Object.keys(errors).length > 0 ? (
                                    <span className="flex items-center gap-2">
                                        <Icons.Error className="w-4 h-4 animate-pulse"/>
                                        {(isEdit ? 'Update' : 'Add')}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Icons.Action.Add/>
                                        {(isEdit ? 'Update' : 'Add')}
                                    </span>
                                )}
                            </button>
                        </div>
                    </FormPart>
                </form>
            </div>
        </div>
    );
}