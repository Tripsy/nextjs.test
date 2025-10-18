import type { Metadata } from 'next';
import NavBreadcrumbSetter from '@/app/dashboard/_components/nav-breadcrumb.setter';
import type { BreadcrumbType } from '@/app/dashboard/_providers/breadcrumb.provider';
import { lang } from '@/config/lang';

export const metadata: Metadata = {
	title: `Dashboard | ${lang('app.name')}`,
};

export default function Page() {
	const items: BreadcrumbType[] = [{ label: 'Dashboard' }];

	return (
		<>
			<NavBreadcrumbSetter items={items} />
			Dashboard
		</>
	);
}
