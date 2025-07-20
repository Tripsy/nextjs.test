import {v4 as uuid} from 'uuid';

export function capitalizeFirstLetter(str: string): string {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

export function formatCurrency(value: number, currency: string = 'USD'): string {
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency: currency
    });
}

/**
 * Get the value of a key in an object
 * ex: key = "user.create"
 *
 * @param {Record<string, any>} obj - The object to get the value from
 * @param {string} key - The key to get the value of
 * @returns {any} - The value of the key
 */
export function getObjectValue(obj: Record<string, any>, key: string): any {
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
}

/**
 * Replace variables in a string
 * Ex variables: {{key}}, {{Key}}, {{sub_key}}, {{key1}}
 *
 * @param {string} content - The string to replace template variables in
 * @param {Record<string, string>} vars - The template variables to replace
 * @returns {string} - The string with template variables replaced
 */
export function replaceVars(content: string, vars: Record<string, string> = {}): string {
    return content.replace(/{{(\w+)}}/g, (_, key) => (key in vars ? vars[key] : `{{${key}}}`));
}

/**
 *  Utility function that extracts the first two initials from a name, handling both single and multi-part words
 *
 * @param {string} name - The name to get the initials of
 * @returns {string} - The initials of the name
 */
export function getNameInitials(name: string | undefined): string {
    if (!name) {
        return '';
    }

    const parts = name.trim().split(/\s+/); // Split by any whitespace

    if (parts.length === 1) {
        // Single name, return first 2 letters
        return parts[0].slice(0, 2).toUpperCase();
    }

    // Multi-part name, take first letter of first two words
    return (parts[0][0] + '.'+ parts[1][0]).toUpperCase();
}

export function randomString(type: string = 'uuid'): string {
    return uuid();
}