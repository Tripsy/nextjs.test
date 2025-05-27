# TODO

1. Layout main container ..height
2. Table filter
3. Table actions - global
4. onRowSelect - present actions (edit / delete)
5. login 
6. auth

# IDEAS

1. header right menu - add history to keep track of last 10 pages

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

type FilterBodyTemplateProps = {
filters: DataTableFilterMeta;
setFilters: React.Dispatch<React.SetStateAction<DataTableFilterMeta>>;
};

export const FilterBodyTemplate = ({
filters,
setFilters,
}: FilterBodyTemplateProps): React.JSX.Element => {
const [term, setTerm] = useState<string>('');
const [selectedStatus, setSelectedStatus] = useState<UserStatusEnum | null>(null);
const [selectedRole, setSelectedRole] = useState<UserRoleEnum | null>(null);

    useEffect(() => {
        setFilters({
            global: { value: term, matchMode: 'contains' },
            status: { value: selectedStatus, matchMode: 'equals' },
            role: { value: selectedRole, matchMode: 'equals' },
        });
    }, [term, selectedStatus, selectedRole]);

    return (
        <div className="flex gap-x-4">
            <IconField iconPosition="left">
                <InputIcon>
                    <div className="flex items-center">
                        <Icons.Search className="w-4 h-4" />
                    </div>
                </InputIcon>
                <InputText
                    placeholder="Search"
                    value={term}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTerm(e.target.value)}
                />
            </IconField>

            <Dropdown
                value={selectedStatus}
                options={statuses}
                onChange={(e: DropdownChangeEvent) => setSelectedStatus(e.value)}
                placeholder="Status"
                showClear
            />

            <Dropdown
                value={selectedRole}
                options={roles}
                onChange={(e: DropdownChangeEvent) => setSelectedRole(e.value)}
                placeholder="Role"
                showClear
            />
        </div>
    );
};
