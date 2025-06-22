import {Nullable} from 'primereact/ts-helpers';

export function capitalizeFirstLetter(str: string): string {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

export function getValidDate(date: unknown): Date | undefined {
    return date instanceof Date ? date : undefined;
}

export function formatDate(value: string | Date): string {
    const date = new Date(value);

    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

export function formatDateFromFilter(value: Nullable<Date>): string | null {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    return date.toISOString().split('T')[0]; // eg: 2023-05-20
}

export function parseDate (value: string | null | undefined): Date | null {
    if (!value) {
        return null;
    }

    return new Date(value);
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