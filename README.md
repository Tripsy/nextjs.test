# TODO

1. do updates on back-end first
2. Add CSRF (Cross-Site Request Forgery) protection to your Next.js middleware involves generating and verifying a unique token for sensitive requests
3. recover password & other account pages
4. Remove border bottom from paginator
5. Use `register` for inspiration and update filters on dashboard/users 
6. check data-table-users.component.ts notes
     consider idea - for single selection: onRowSelect - present actions (edit / delete) - at mouse position (see statamic)
7. terms page
8. Theme switcher has a glitch on first click?
9. Replace all console.error with logging
   
# IDEAS

1. dashboard - add history to keep track of last 10 pages
2. login with google / facebook

# SEE ALSO

     https://nextjs.org/docs/app/getting-started/partial-prerendering

# NOTES

- authorization checks are done both via middleware and via protected-route.component (TODO: not yet build)
- middleware.ts has a special config which controls via `matcher` what requests are handled by middleware
- middleware.ts will add special headers via `responseSuccess` - for production ready it will need some revision

# BUGS & ISSUES

- because Next.js can't run (io)redis in middleware, the rate limit build in middleware.ts is disabled - see commented code in middleware.ts
- there is no fall back in case Redis is not available

# RESOURCES

     https://primereact.org/datatable/

# INSPIRATION

https://nexus.daisyui.com/auth/register

# SAMPLES

// Server (Node.js)
io.on("connection", (socket) => {
socket.on("send-message", (msg) => {
io.emit("new-message", msg); // Broadcast to all clients
});
});

// Client (Browser)
socket.on("new-message", (msg) => {
addMessageToUI(msg); // Update chat UI
});

-------------------------

<Notice type="error" message="Testing error layout" />

<Notice type="warning" message="Testing error layout" />

<Notice type="loading" />

<Notice type="info" message="Testing info layout" />

<Notice type="success" message="Testing info layout" />


-------------------------

// When user updates their profile
const updateProfile = async (data) => {
const updatedUser = await api.updateProfile(auth.id, data);
setAuth({ ...auth, ...updatedUser }); // Merge updates
};

// In your auth provider - Cross-Tab Sync
useEffect(() => {
const handleStorage = (e: StorageEvent) => {
if (e.key === 'auth-event') {
const newAuth = JSON.parse(e.newValue || 'null');
setAuth(newAuth); // Sync across browser tabs
}
};

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
}, []);
