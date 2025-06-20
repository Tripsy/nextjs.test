'use client';

import React, {useActionState} from 'react';
import {loginAction} from '@/app/account/actions/login.action';

export default function LoginForm() {
    const [state, action, pending] = useActionState(loginAction, undefined)

    return (
        <form action={action}>
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" placeholder="Email" autoComplete={"email"}/>
            </div>
            {state?.errors?.email && (
                <p>{state.errors.email}</p>
            )}

            <div>
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" autoComplete={"current-password"}/>
            </div>
            {state?.errors?.password && (
                <p>{state.errors.password}</p>
            )}

            <button disabled={pending} type="submit">
                Sign Up
            </button>
        </form>
    )
}