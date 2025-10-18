import type { Metadata } from 'next';
import NavBreadcrumbSetter from '@/app/dashboard/_components/nav-breadcrumb.setter';
import type { BreadcrumbType } from '@/app/dashboard/_providers/breadcrumb.provider';
import { DataTableUsers } from '@/app/dashboard/users/data-table-users.component';
import { lang } from '@/config/lang';
import Routes from '@/config/routes';

export const metadata: Metadata = {
	title: `Users - Dashboard | ${lang('app.name')}`,
};

export default function Page() {
	const items: BreadcrumbType[] = [
		{ label: 'Dashboard', href: Routes.get('dashboard') },
		{ label: 'Users' },
	];

	return (
		<>
			<NavBreadcrumbSetter items={items} />
			<DataTableUsers />
		</>
	);
}
