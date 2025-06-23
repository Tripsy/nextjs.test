# TODO

1. register 
    - clear the error on user interaction with a field - see DeepSeek solution
2. login / auth
3. Remove border bottom from paginator
4. check data-table-users.component.ts notes
     consider idea - for single selection: onRowSelect - present actions (edit / delete) - at mouse position (see statamic)
5. terms page
6. recover password
7. other account pages 
   
# IDEAS

1. dashboard - add history to keep track of last 10 pages
2. login with google / facebook

# SEE ALSO

     https://nextjs.org/docs/app/getting-started/partial-prerendering

# NOTES

To pass props, add them to the JSX, just like you would with HTML attributes.
To read props, use the function Avatar({ person, size }) destructuring syntax.
You can specify a default value like size = 100, which is used for missing and undefined props.
You can forward all props with <Avatar {...props} /> JSX spread syntax, but don’t overuse it!
Nested JSX like <Card><Avatar /></Card> will appear as Card component’s children prop.
Props are read-only snapshots in time: every render receives a new version of props.
You can’t change props. When you need interactivity, you’ll need to set state.

Don’t use window or localStorage in useState initializer — React will render it differently on server vs. client.

# RESOURCES

     https://primereact.org/datatable/

# INSPIRATION

https://nexus.daisyui.com/auth/register

# SAMPLES

            <div>
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" />
            </div>
            {state?.errors?.password && (
                <div>
                    <p>Password must:</p>
                    <ul>
                        {state.errors.password.map((error) => (
                            <li key={error}>- {error}</li>
                        ))}
                    </ul>
                </div>
            )}



    const clearError = (fieldName: keyof RegisterFormValues) => {
        if (state?.errors?.[fieldName]) {
            action({
                ...state,
                errors: {
                    ...state.errors,
                    [fieldName]: undefined
                }
            });
        }
    };


                            onChange={() => clearError('name')}