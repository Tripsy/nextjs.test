# TODO

1. auth
   - instead of using getAuth from auth.provider - consider suppling a prop from req via middleware - yeah it's a good idea
   - auth provider can use cached data - check test.ts for cases when auth should be refreshed
   - TODO: could be moved in a ProtectedRoute component       .... (this will not be global) aut.provider should be global
   - if role is not admin or operator redirect outside dashboard if operator and doesn't have role just show restricted
2. in dashboard we have error boundary ..if we catch 401 or 403 act accordingly 
3. recover password & other account pages
4. email-confirm
    - do updates back-end first
5. Remove border bottom from paginator
6. Use `register` for inspiration and update filters
7. check data-table-users.component.ts notes
     consider idea - for single selection: onRowSelect - present actions (edit / delete) - at mouse position (see statamic)
8. terms page
9. Them switcher has a glitch on first click
10. Replace all console.error with logging
   
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