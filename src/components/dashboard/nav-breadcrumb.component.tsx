'use client';

import Link from 'next/link';
import {useBreadcrumb} from '@/providers/dashboard/breadcrumb.provider';
import Routes from '@/config/routes';
import {useMediaQuery} from 'react-responsive';

type NavBreadcrumbProps = {
    position: 'mobile' | 'desktop';
};

export const NavBreadcrumb = ({position} : NavBreadcrumbProps) => {
    const {items} = useBreadcrumb();

    const isMobile = useMediaQuery({maxWidth: 767});

    if (isMobile && position === 'desktop') {
        return null;
    }

    if (!isMobile && position === 'mobile') {
        return null;
    }

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
