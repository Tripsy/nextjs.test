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
            <div className="nav-group">
                <div className="nav-group-title">
                    Content
                </div>
                <ul>
                    <li>
                        <Link
                            href={Routes.get('project-list')}
                        >
                            <FontAwesomeIcon icon={faDiagramProject} className="inline-block w-5 h-5 mr-0.75"/>
                            Projects
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="nav-group">
                <div className="nav-group-title">
                    Settings
                </div>
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
            </div>
            <div className="nav-group">
                <div className="nav-group-title">
                    Logs
                </div>
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
            </div>
            <div className="nav-group">
                <div className="nav-group-title">
                    Users
                </div>
                <ul>
                    <li>
                        <Link
                            href=""
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
            </div>
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