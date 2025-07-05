'use client';

import React, {useLayoutEffect, useState} from 'react';
import Link from 'next/link';
import Routes from '@/lib/routes';
import {
    faDiagramProject,
    faUserLock,
    faFileLines,
    faDatabase,
    faFileWaveform,
    faEnvelopesBulk,
    faUserGroup, IconDefinition
} from '@fortawesome/free-solid-svg-icons';
import {useDebouncedEffect} from '@/hooks';
import {AwesomeIcon} from '@/components/icon.component';

type SideMenuGroupProps = {
    groupKey: string;
    defaultOpen?: boolean;
    title: string;
    children: React.ReactNode;
};

function SideMenuGroup({groupKey, defaultOpen, title, children}: SideMenuGroupProps) {
    const groupKeyStorage = `side-menu-open-${groupKey}`;

    const [open, setOpen] = useState<boolean>(() => defaultOpen ?? false);

    useLayoutEffect(() => {
        const openStorage: string | null = localStorage.getItem(groupKeyStorage);

        if (openStorage !== null && openStorage !== 'undefined') {
            setOpen(JSON.parse(openStorage));
        }
    }, [groupKeyStorage]);

    useDebouncedEffect(() => {
        localStorage.setItem(groupKeyStorage, JSON.stringify(open));
    }, [open], 1000);

    const handleToggle = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        setOpen(previousState => !previousState);
    };

    return (
        <details open={open} className="side-menu-group">
            <summary className="side-menu-group-title" onClick={handleToggle}>
                {title}
            </summary>
            <ul>
                {children}
            </ul>
        </details>
    );
}

type SideMenuItemProps = {
    href: string;
    label: string;
    icon: IconDefinition;
};

function SideMenuGroupItem({ href, label, icon }: SideMenuItemProps) {
    return (
        <li>
            <Link href={href}>
                <AwesomeIcon icon={icon} className="inline-block w-5 h-5 mr-0.75" />
                {label}
            </Link>
        </li>
    );
}

export function SideMenu() {
    return (
        <nav className="side-menu-section">
            <SideMenuGroup groupKey="side-menu-content" title="Content">
                <SideMenuGroupItem href="#" label="Projects" icon={faDiagramProject} />
            </SideMenuGroup>

            <SideMenuGroup groupKey="side-menu-settings" title="Settings">
                <SideMenuGroupItem href="#" label="Templates" icon={faFileLines} />
            </SideMenuGroup>

            <SideMenuGroup groupKey="side-menu-logs" title="Logs">
                <SideMenuGroupItem href="#" label="Log Data" icon={faDatabase} />
                <SideMenuGroupItem href="#" label="Cron History" icon={faFileWaveform} />
                <SideMenuGroupItem href="#" label="Mail Queue" icon={faEnvelopesBulk} />
            </SideMenuGroup>

            <SideMenuGroup groupKey="side-menu-users" defaultOpen title="Users">
                <SideMenuGroupItem href={Routes.get('user-list')} label="Users" icon={faUserGroup} />
                <SideMenuGroupItem href="#" label="Permissions" icon={faUserLock} />
            </SideMenuGroup>
        </nav>
    );
}