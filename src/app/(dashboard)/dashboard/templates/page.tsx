import type { Metadata } from 'next';
import NavBreadcrumbSetter from '@/app/(dashboard)/_components/nav-breadcrumb.setter';
import type { BreadcrumbType } from '@/app/(dashboard)/_providers/breadcrumb.provider';
import { DataTableTemplates } from '@/app/(dashboard)/dashboard/templates/data-table-templates.component';
import { translate } from '@/config/lang';
import Routes from '@/config/routes';
import { cfg } from '@/config/settings';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: await translate('templates.meta.title', {
			app_name: cfg('app.name') as string,
		}),
	};
}

export default async function Page() {
	const items: BreadcrumbType[] = [
		{
			label: await translate('dashboard.labels.dashboard'),
			href: Routes.get('dashboard'),
		},
		{ label: await translate('dashboard.labels.templates') },
	];

	return (
		<>
			<NavBreadcrumbSetter items={items} />
			<DataTableTemplates />
		</>
	);
}
