'use client';

import Link from 'next/link';
import {useBreadcrumb} from '@/providers/dashboard/breadcrumb.provider';
import Routes from '@/config/routes';

export const NavBreadcrumb = () => {
    const {items} = useBreadcrumb();

    return (
        <div className="breadcrumbs text-sm max-md:p-0 max-md:mb-6">
            <ul>
                {items.map((item, idx) => (
                    <li key={idx}>
                        {
                            item.href ? (
                                <Link
                                    href={Routes.get(item.href)}
                                    className="link link-hover"
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
