'use client'

import React from 'react';
import Link from 'next/link';
import Routes from '@/lib/routes';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faDiagramProject,
    faUserLock,
    faFileLines,
    faDatabase,
    faFileWaveform,
    faEnvelopesBulk,
    faUserGroup
} from '@fortawesome/free-solid-svg-icons';
import {useSideMenu} from '@/app/dashboard/providers/side-menu.provider';

export function SideMenu() {
    return (
        <nav className="nav-container">
            <details open className="nav-group">
                <summary className="nav-group-title">
                    Content
                </summary>
                <ul>
                    <li>
                        <Link
                            href="#"
                        >
                            <FontAwesomeIcon icon={faDiagramProject} className="inline-block w-5 h-5 mr-0.75"/>
                            Projects
                        </Link>
                    </li>
                </ul>
            </details>
            <details className="nav-group">
                <summary className="nav-group-title">
                    Settings
                </summary>
                <ul>
                    <li>
                        <Link
                            href="#"
                        >
                            <FontAwesomeIcon icon={faFileLines} className="inline-block w-5 h-5 mr-0.75"/>
                            Templates
                        </Link>
                    </li>
                </ul>
            </details>
            <details className="nav-group">
                <summary className="nav-group-title">
                    Logs
                </summary>
                <ul>
                    <li>
                        <Link
                            href="#"
                        >
                            <FontAwesomeIcon icon={faDatabase} className="inline-block w-5 h-5 mr-0.75"/>
                            Log Data
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#"
                        >
                            <FontAwesomeIcon icon={faFileWaveform} className="inline-block w-5 h-5 mr-0.75"/>
                            Cron History
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#"
                        >
                            <FontAwesomeIcon icon={faEnvelopesBulk} className="inline-block w-5 h-5 mr-0.75"/>
                            Mail Queue
                        </Link>
                    </li>
                </ul>
            </details>
            <details className="nav-group">
                <summary className="nav-group-title">
                    Users
                </summary>
                <ul>
                    <li>
                        <Link
                            href={Routes.get('user-list')}
                        >
                            <FontAwesomeIcon icon={faUserGroup} className="inline-block w-5 h-5 mr-0.75"/>
                            Users
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#"
                        >
                            <FontAwesomeIcon icon={faUserLock} className="inline-block w-5 h-5 mr-0.75"/>
                            Permissions
                        </Link>
                    </li>
                </ul>
            </details>
        </nav>
    );
}

export function MainContainer({children}: { children: React.ReactNode }) {
    const {status} = useSideMenu();

    return (
        <main className={`main-container nav-${status}`}>
            <SideMenu/>
            <div className="content-container">
                {children}
            </div>
        </main>
    );
}