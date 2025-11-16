'use client';

import { useEffect } from 'react';
import {
	type BreadcrumbType,
	useBreadcrumb,
} from '@/app/(dashboard)/_providers/breadcrumb.provider';

export default function NavBreadcrumbSetter({
	items,
}: {
	items: BreadcrumbType[];
}) {
	const { setItems } = useBreadcrumb();

	useEffect(() => {
		setItems([...items]);
	}, [items, setItems]);

	return null;
}
