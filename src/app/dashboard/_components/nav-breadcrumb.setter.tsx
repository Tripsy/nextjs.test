'use client';

import {useEffect} from 'react';
import {BreadcrumbType, useBreadcrumb} from '@/providers/dashboard/breadcrumb.provider';

export default function NavBreadcrumbSetter({items}: { items: BreadcrumbType[] }) {
    const {setItems} = useBreadcrumb();

    useEffect(() => {
        setItems([...items]);
    }, [items, setItems]);

    return null;
}