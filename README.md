# TODO

1. Check login flow
2. recover password & other account pages
3. Remove border bottom from paginator
4. Use `register` for inspiration and update filters on dashboard/users 
5. check data-table-users.component.ts notes
     consider idea - for single selection: onRowSelect - present actions (edit / delete) - at mouse position (see statamic)
6. terms page
7. Theme switcher has a glitch on first click?
8. Replace all console.error with logging


https://nextjs.org/docs/app/api-reference/components/form
https://nextjs.org/docs/app/api-reference/functions/use-params
   
# IDEAS

1. dashboard - add history to keep track of last 10 pages
2. login with google / facebook

# SEE ALSO

     https://nextjs.org/docs/app/getting-started/partial-prerendering
     https://react.dev/learn/react-compiler/introduction

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

# LEARNING

- It is useful to remember which operations on arrays mutate them, and which don’t. For example, push, pop, reverse, 
and sort will mutate the original array, but slice, filter, and map will create a new one.

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