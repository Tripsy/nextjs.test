# TODO

1. refactor structure - table-list > table > make separate filters component
1. change color for the horizontal line after filters
1. rename fetchFunction to findFunction
1. make filters section sticky 
1. selection fixes

prompt for AI: 

selected entries are not marked when i navigate away and come back ..but the selectedEntries.lengh value says I have entries selected. I don't know if the entries are really selected and not marked or simple the selectedEntries.length does not reset

1. add entry button / add delete button - should be grey if no entry is selected
   - some table should allow multiple selection, some no
     - the delete button next to add is for multiple selection
       - for single selection: onRowSelect - present actions (edit / delete) - at mouse position (see statamic)
2. login 
3. auth

# IDEAS

1. header right menu - add history to keep track of last 10 pages

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

https://mui.com/material-ui/react-table/
https://github.com/jbetancur/react-data-table-component
https://primereact.org/datatable/

    if (!responseBody?.data) {
        throw new Error('Invalid API response structure');
    }
    return {
        entries: responseBody?.data.entries || [],
        pagination: responseBody?.data.pagination || {
            page: 1,
            limit: 10,
            total: 0
        },
    };