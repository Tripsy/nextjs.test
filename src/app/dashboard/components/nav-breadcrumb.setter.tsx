'use client';

import {useEffect} from 'react';
import {BreadcrumbType, useBreadcrumb} from '@/app/dashboard/providers/breadcrumb.provider';

export default function NavBreadcrumbSetter({items}: { items: BreadcrumbType[] }) {
    const {setItems} = useBreadcrumb();

    useEffect(() => {
        setItems([...items]);
    }, [items]);

    return null;
}