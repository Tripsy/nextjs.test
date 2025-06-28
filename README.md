# TODO

1. auth
    - TODO: could be moved in a ProtectedRoute component
     - if role is not admin or operator redirect outside dashboard if operator and doesn't have role just show restricted
    - some sort of refresh token mechanism to keep user logged in > get info from remote API maybe 
    - logout > destroy session + api request to logout + redirect
    - Protect Routes (Auth Gate) - middleware > routes.tsx has some notes about refactoring

2. recover password & other account pages
3. email-confirm
    - do updates on node.js first
4. Remove border bottom from paginator
5. Use `register` for inspiration and update filters
6. check data-table-users.component.ts notes
     consider idea - for single selection: onRowSelect - present actions (edit / delete) - at mouse position (see statamic)
7. terms page
8. Them switcher has a glitch on first click
   
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


I need an authProvider 
    
import { verifySession } from '@/app/lib/dal'

export default function Dashboard() {
const session = await verifySession()
const userRole = session?.user?.role // Assuming 'role' is part of the session object

if (userRole === 'admin') {
return <AdminDashboard />
} else if (userRole === 'user') {
return <UserDashboard />
} else {
redirect('/login')
}
}



.then(r => {
return r;
})