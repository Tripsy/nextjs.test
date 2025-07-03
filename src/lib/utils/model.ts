/**
 * Normalizes date fields in an object while preserving all other properties
 * @param obj Object containing date strings
 * @param dateFields Array of date field names to normalize (default: ['created_at', 'updated_at'])
 */
export function normalizeDates<T extends Record<string, any>>(
    obj: T | null,
    dateFields: string[] = ['created_at', 'updated_at']
): { [K in keyof T]: K extends typeof dateFields[number] ? Date : T[K] } | null {
    if (!obj) return null;

    const result = {...obj};

    dateFields.forEach(field => {
        if (field in result) {
            (result as Record<string, any>)[field] = new Date(obj[field as keyof T]);
        }
    });

    return result as { [K in keyof T]: K extends typeof dateFields[number] ? Date : T[K] };
}