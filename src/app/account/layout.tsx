import type React from 'react';
import LayoutDefault from '@/components/layout-default.component';

export default function Layout({ children }: { children: React.ReactNode }) {
	return <LayoutDefault>{children}</LayoutDefault>;
}
