# TODO

1. test rate limit - response?
2. session token expiration need to sync with account token expiration
3. in dashboard we have error boundary ..if we catch 401 or 403 act accordingly 
4. auth
    - TODO: could be moved in a ProtectedRoute component
    - if role is not admin or operator redirect outside dashboard if operator and doesn't have role just show restricted
    - some sort of refresh token mechanism to keep user logged in > get info from remote API maybe 

5. recover password & other account pages
6. email-confirm
    - do updates on node.js first
7. Remove border bottom from paginator
8. Use `register` for inspiration and update filters
9. check data-table-users.component.ts notes
     consider idea - for single selection: onRowSelect - present actions (edit / delete) - at mouse position (see statamic)
10. terms page
11. Them switcher has a glitch on first click
   
# IDEAS

1. dashboard - add history to keep track of last 10 pages
2. login with google / facebook
3. Adding CSRF (Cross-Site Request Forgery) protection to your Next.js middleware involves generating and verifying a unique token for sensitive requests

# SEE ALSO

     https://nextjs.org/docs/app/getting-started/partial-prerendering

# NOTES

 - authorization checks are done both via middleware and via protected-route.component (TODO: not yet build)
 - middleware.ts has a special config which controls via `matcher` what requests are handled by middleware

# RESOURCES

     https://primereact.org/datatable/

# INSPIRATION

https://nexus.daisyui.com/auth/register

# SAMPLES