import type { Metadata } from 'next';
import NavBreadcrumbSetter from '@/app/(dashboard)/_components/nav-breadcrumb.setter';
import type { BreadcrumbType } from '@/app/(dashboard)/_providers/breadcrumb.provider';
import { DataTablePermissions } from '@/app/(dashboard)/dashboard/permissions/data-table-permissions.component';
import { translate } from '@/config/lang';
import Routes from '@/config/routes';
import { cfg } from '@/config/settings';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: await translate('permissions.meta.title', {
			app_name: cfg('app.name') as string,
		}),
	};
}

export default function Page() {
	const items: BreadcrumbType[] = [
		{ label: 'Dashboard', href: Routes.get('dashboard') },
		{ label: 'Permissions' },
	];

	return (
		<>
			<NavBreadcrumbSetter items={items} />
			<DataTablePermissions />
		</>
	);
}
