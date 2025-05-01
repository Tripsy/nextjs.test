'use client'

import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faMoon, faSun
} from '@fortawesome/free-solid-svg-icons';
import {useTheme} from '@/app/providers/theme.provider';

export function ToggleTheme() {
    const { toggleTheme } = useTheme();

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        toggleTheme(e.target.checked ? 'dark' : 'light');
    };

    return (
        <label aria-label="Toggle Theme" className="swap swap-rotate mr-5">
            <input type="checkbox" onChange={handleToggle}/>

            <FontAwesomeIcon icon={faSun} className="swap-off w-5 h-5"/>
            <FontAwesomeIcon icon={faMoon} className="swap-on on w-5 h-5"/>
        </label>
    );
}