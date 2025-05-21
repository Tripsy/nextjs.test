import BreadcrumbSetter from '@/app/dashboard/components/breadcrumb-setter';
import {BreadcrumbType} from '@/app/dashboard/providers/breadcrumb.provider';
import DataTableList, {TableColumnsType} from '@/app/dashboard/components/table-list.component';
import {statusBodyTemplate} from '@/app/dashboard/components/table-row-status.component';

export default function Page() {
    const items: BreadcrumbType[] = [
        {label: 'Dashboard', href: 'dashboard'},
        {label: 'Projects'},
    ];

    const columns: TableColumnsType = [
        {field: 'id', header: 'ID', sortable: true},
        {field: 'name', header: 'Name', sortable: true},
        {field: 'email', header: 'Email'},
        {field: 'role', header: 'Role'},
        {field: 'status', header: 'Status', body: statusBodyTemplate},
        {field: 'created_at', header: 'Created At', sortable: true},
    ];

    return (
        <>
            <BreadcrumbSetter items={items}/>
            <DataTableList dataSource="users" columns={columns}/>
        </>
    );
}