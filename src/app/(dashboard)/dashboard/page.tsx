import type { Metadata } from 'next';
import NavBreadcrumbSetter from '@/app/(dashboard)/_components/nav-breadcrumb.setter';
import type { BreadcrumbType } from '@/app/(dashboard)/_providers/breadcrumb.provider';
import { translate } from '@/config/lang';
import { cfg } from '@/config/settings';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: await translate('dashboard.meta.title', {
			app_name: cfg('app.name') as string,
		}),
	};
}

export default async function Page() {
	const items: BreadcrumbType[] = [
		{ label: await translate('dashboard.labels.dashboard') },
	];

	return (
		<>
			<NavBreadcrumbSetter items={items} />
			Dashboard
		</>
	);
}
