'use client';

import {
	faDatabase,
	faDiagramProject,
	faEnvelopesBulk,
	faFileLines,
	faFileWaveform,
	faUserGroup,
	faUserLock,
	type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { AwesomeIcon } from '@/components/icon.component';
import Routes from '@/config/routes';
import { useDebouncedEffect } from '@/hooks';
import { hasPermission } from '@/lib/models/auth.model';
import { useAuth } from '@/providers/auth.provider';

type SideMenuGroupProps = {
	groupKey: string;
	title: string;
	defaultOpen?: boolean;
	children: React.ReactNode;
};

function SideMenuGroup({
	groupKey,
	title,
	defaultOpen = false,
	children,
}: SideMenuGroupProps) {
	const groupKeyStorage = `side-menu-open-${groupKey}`;

	const [open, setOpen] = useState<boolean>(() => defaultOpen);

	useLayoutEffect(() => {
		const openStorage: string | null =
			localStorage.getItem(groupKeyStorage);

		if (openStorage !== null && openStorage !== 'undefined') {
			setOpen(JSON.parse(openStorage));
		}
	}, [groupKeyStorage]);

	useDebouncedEffect(
		() => {
			localStorage.setItem(groupKeyStorage, JSON.stringify(open));
		},
		[open],
		1000,
	);

	const handleToggle = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();

		setOpen((previousState) => !previousState);
	};

	const validChildren = React.Children.toArray(children).filter(Boolean);

	if (validChildren.length === 0) {
		return null;
	}

	return (
		<details open={open} className="side-menu-group">
			<summary
				className="side-menu-group-title"
				onClick={handleToggle}
				role="button"
			>
				{title}
			</summary>
			<ul>{children}</ul>
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
				<AwesomeIcon
					icon={icon}
					className="w-4 h-4 inline-block mr-0.75"
				/>
				{label}
			</Link>
		</li>
	);
}

export function SideMenu() {
	const { auth } = useAuth();

	// Memoize the menu groups to prevent unnecessary re-renders
	const menuGroups = useMemo(() => {
		const groups = [
			{
				key: 'content',
				title: 'Content',
				items: [
					{
						href: '',
						label: 'Projects',
						icon: faDiagramProject,
						permission: true,
					},
				],
			},
			{
				key: 'settings',
				title: 'Settings',
				items: [
					{
						href: Routes.get('template-find'),
						label: 'Templates',
						icon: faFileLines,
						permission: hasPermission(auth, 'template.find'),
					},
				],
			},
			{
				key: 'logs',
				title: 'System Logs',
				items: [
					{
						href: Routes.get('log-data-find'),
						label: 'Log Data',
						icon: faDatabase,
						permission: hasPermission(auth, 'log_data.find'),
					},
					{
						href: Routes.get('cron-history-find'),
						label: 'Cron History',
						icon: faFileWaveform,
						permission: hasPermission(auth, 'cron_history.find'),
					},
					{
						href: Routes.get('mail-queue-find'),
						label: 'Mail Queue',
						icon: faEnvelopesBulk,
						permission: hasPermission(auth, 'mail_queue.find'),
					},
				],
			},
			{
				key: 'users',
				title: 'Users',
				defaultOpen: true,
				items: [
					{
						href: Routes.get('user-find'),
						label: 'Users',
						icon: faUserGroup,
						permission: hasPermission(auth, 'user.find'),
					},
					{
						href: Routes.get('permission-find'),
						label: 'Permissions',
						icon: faUserLock,
						permission: hasPermission(auth, 'permission.find'),
					},
				],
			},
		];

		return groups.map((group) => {
			const visible = group.items.some((item) => item.permission);

			// Don't render groups with no visible items
			if (!visible) {
				return null;
			}

			return (
				<SideMenuGroup
					key={`side-menu-${group.key}`}
					groupKey={`side-menu-${group.key}`}
					title={group.title}
					defaultOpen={group.defaultOpen}
				>
					{group.items.map(
						(item) =>
							item.permission && (
								<SideMenuGroupItem
									key={`side-menu-${group.key}-${item.label}`}
									href={item.href}
									label={item.label}
									icon={item.icon}
								/>
							),
					)}
				</SideMenuGroup>
			);
		});
	}, [auth]);

	return <nav className="side-menu-section">{menuGroups}</nav>;
}
