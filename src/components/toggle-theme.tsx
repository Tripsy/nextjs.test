'use client'

import React from 'react';
import {useTheme} from '@/providers/theme.provider';
import {Icons} from './icon.component';

export function ToggleTheme() {
    const {toggleTheme} = useTheme();

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        toggleTheme(e.target.checked ? 'dark' : 'light');
    };

    return (
        <label aria-label="Toggle Theme" className="swap swap-rotate mr-5">
            <input type="checkbox" onChange={handleToggle}/>

            <Icons.ToggleThemeDay className="swap-off w-5 h-5"/>
            <Icons.ToggleThemeNight className="swap-on on w-5 h-5"/>
        </label>
    );
}