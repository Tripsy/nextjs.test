'use client';

import React from 'react';
import {useTheme} from '@/providers/theme.provider';
import {Icons} from './icon.component';

export function ToggleTheme() {
    const {theme, toggleTheme} = useTheme();

    const handleToggle = () => {
        toggleTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <label className="relative inline-flex items-center cursor-pointer mr-5">
            <input
                type="checkbox"
                className="sr-only"
                checked={theme === 'dark'}
                onChange={handleToggle}
            />
            <div className="relative w-10 h-10">
                <div className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                    theme === 'dark' ? 'rotate-0' : 'rotate-180'
                }`}>
                    <Icons.ThemeLight className={`absolute inset-0 m-auto w-5 h-5 transition-opacity duration-300 ${
                        theme === 'light' ? 'opacity-100' : 'opacity-0'
                    }`} />
                    <Icons.ThemeDark className={`absolute inset-0 m-auto w-5 h-5 transition-opacity duration-300 ${
                        theme === 'dark' ? 'opacity-100' : 'opacity-0'
                    }`} />
                </div>
            </div>
        </label>
    );
}