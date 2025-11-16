import type { Metadata } from 'next';
import NavBreadcrumbSetter from '@/app/dashboard/_components/nav-breadcrumb.setter';
import type { BreadcrumbType } from '@/app/dashboard/_providers/breadcrumb.provider';
import { DataTableCronHistory } from '@/app/dashboard/cron-history/data-table-cron-history.component';
import { translate } from '@/config/lang';
import Routes from '@/config/routes';
import { cfg } from '@/config/settings';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: await translate('cron_history.meta.title', {
			app_name: cfg('app.name') as string,
		}),
	};
}
export default function Page() {
	const items: BreadcrumbType[] = [
		{ label: 'Dashboard', href: Routes.get('dashboard') },
		{ label: 'Cron History' },
	];

	return (
		<>
			<NavBreadcrumbSetter items={items} />
			<DataTableCronHistory />
		</>
	);
}
