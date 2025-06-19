'use client';

import Link from 'next/link';
import {useBreadcrumb} from '@/app/dashboard/providers/breadcrumb.provider';
import Routes from '@/lib/routes';

export const BreadcrumbHeader = () => {
    const {items} = useBreadcrumb();

    return (
        <div className="breadcrumbs text-sm">
            <ul>
                {items.map((item, idx) => (
                    <li key={idx}>
                        {
                            item.href ? (
                                <Link
                                    href={Routes.get(item.href)}
                                    className="link-default"
                                >
                                    {item.label}
                                </Link>
                            ) : item.label
                        }
                    </li>
                ))}
            </ul>
        </div>
    );
};
