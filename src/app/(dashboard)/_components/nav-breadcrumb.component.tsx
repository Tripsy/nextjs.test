'use client';

import Link from 'next/link';
import { useBreadcrumb } from '@/app/(dashboard)/_providers/breadcrumb.provider';

export const NavBreadcrumb = () => {
	const { items } = useBreadcrumb();

	return (
		<div className="breadcrumbs text-sm max-md:p-0 max-md:mb-6">
			<ul>
				{items.map((item) => (
					<li key={`nav-breadcrumb-${item.label}`}>
						{item.href ? (
							<Link href={item.href} className="link link-hover">
								{item.label}
							</Link>
						) : (
							item.label
						)}
					</li>
				))}
			</ul>
		</div>
	);
};
