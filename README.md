# TODO

1. check if app() works in components
2. auth
   - check test.ts for cases when setAuth should be triggered
   - TODO: could be moved in a ProtectedRoute component       .... (this will not be global) aut.provider should be global
   - if role is not admin or operator redirect outside dashboard if operator and doesn't have role just show restricted
3. in dashboard we have error boundary ..if we catch 401 or 403 act accordingly 
4. recover password & other account pages
5. email-confirm
    - do updates back-end first
6. Remove border bottom from paginator
7. Use `register` for inspiration and update filters
8. check data-table-users.component.ts notes
     consider idea - for single selection: onRowSelect - present actions (edit / delete) - at mouse position (see statamic)
9. terms page
10. Them switcher has a glitch on first click
11. Replace all console.error with logging
   
# IDEAS

1. dashboard - add history to keep track of last 10 pages
2. login with google / facebook
3. Adding CSRF (Cross-Site Request Forgery) protection to your Next.js middleware involves generating and verifying a unique token for sensitive requests

# SEE ALSO

     https://nextjs.org/docs/app/getting-started/partial-prerendering

# NOTES

- authorization checks are done both via middleware and via protected-route.component (TODO: not yet build)
- middleware.ts has a special config which controls via `matcher` what requests are handled by middleware
- middleware.ts will add special headers via `responseOk` - for production ready it will need some revision

# BUGS & ISSUES

- because Next.js can't run (io)redis in middleware, the rate limit build in middleware.ts is disabled - see commented code in middleware.ts
- there is no fall back in case Redis is not available

# RESOURCES

     https://primereact.org/datatable/

# INSPIRATION

https://nexus.daisyui.com/auth/register

# SAMPLES

Multi-Device Logout
tsx
// When logging out from other devices
socket.on('force-logout', () => {
setAuth(null); // Immediately reflect logout
showNotification('Logged out from another device');
});


// TODO: maybe UserMenu should get auth as prop  ...the loading part doesn't have sense based on the fact this is a dashboard component
// however this logic is good for other parts of the website
export function UserMenu() {
const router = useRouter();

    const {loading, auth} = useAuth();

    // // TODO: could be moved in a ProtectedRoute component
    // useEffect(() => {
    //     if (!loading && !isAuthenticated(auth)) {
    //         router.push(Routes.get('login'));
    //     }
    // }, [loading, auth]);

    if (loading) {
        return (
            <div className="w-8 h-8 animate-pulse rounded-full bg-gray-300" />
        );
    }