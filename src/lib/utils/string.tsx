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
