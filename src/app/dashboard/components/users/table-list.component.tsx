'use client';

import {capitalizeFirstLetter} from '@/lib/utils/string';

export const RoleBodyTemplate = (entry: { role: string; }) => {
    return capitalizeFirstLetter(entry.role);
};