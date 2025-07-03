# TODO

1. test redirect after login
2. Check TODO's
3. session token expiration need to sync with account token expiration
4. in dashboard we have error boundary ..if we catch 401 or 403 act accordingly 
5. auth
    - TODO: could be moved in a ProtectedRoute component
     - if role is not admin or operator redirect outside dashboard if operator and doesn't have role just show restricted
    - some sort of refresh token mechanism to keep user logged in > get info from remote API maybe 
    - logout > destroy session + api request to logout + redirect
    - Protect Routes (Auth Gate) - middleware > routes.tsx has some notes about refactoring

6. recover password & other account pages
7. email-confirm
    - do updates on node.js first
8. Remove border bottom from paginator
9. Use `register` for inspiration and update filters
10. check data-table-users.component.ts notes
      consider idea - for single selection: onRowSelect - present actions (edit / delete) - at mouse position (see statamic)
11. terms page
12. Them switcher has a glitch on first click
   
# IDEAS

1. dashboard - add history to keep track of last 10 pages
2. login with google / facebook

# SEE ALSO

     https://nextjs.org/docs/app/getting-started/partial-prerendering

# NOTES

 - authorization checks are done both via middleware and via protected-route.component (TODO: not yet build)
 - middleware.ts protects only configured routes (check TODO in middleware.ts)

# RESOURCES

     https://primereact.org/datatable/

# INSPIRATION

https://nexus.daisyui.com/auth/register

# SAMPLES