import { v4 as uuid } from 'uuid';

export function capitalizeFirstLetter(str: string): string {
	return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

export function formatCurrency(
	value: number,
	currency: string = 'USD',
): string {
	return value.toLocaleString('en-US', {
		style: 'currency',
		currency: currency,
	});
}

export type ObjectValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| ObjectValue[]
	| { [key: string]: ObjectValue };

/**
 * Get the value of a key in an object
 * ex: key = "user.create"
 *
 * @param {Record<string, any>} obj - The object to get the value from
 * @param {string} key - The key to get the value of
 * @returns {any} - The value of the key
 */
export function getObjectValue(
	obj: { [key: string]: ObjectValue },
	key: string,
): ObjectValue | undefined {
	return key.split('.').reduce<ObjectValue | undefined>((acc, part) => {
		if (
			acc &&
			typeof acc === 'object' &&
			!Array.isArray(acc) &&
			part in acc
		) {
			return (acc as { [key: string]: ObjectValue })[part];
		}
		return undefined;
	}, obj);
}

/**
 * Replace variables in a string
 * Ex variables: {{key}}, {{Key}}, {{sub_key}}, {{key1}}
 *
 * @param {string} content - The string to replace template variables in
 * @param {Record<string, string>} vars - The template variables to replace
 * @returns {string} - The string with template variables replaced
 */
export function replaceVars(
	content: string,
	vars: Record<string, string> = {},
): string {
	return content.replace(/{{(\w+)}}/g, (_, key) =>
		key in vars ? vars[key] : `{{${key}}}`,
	);
}

/**
 *  Utility function that extracts the first two initials from a name, handling both single and multipart words
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

	// Multipart name, take first letter of first two words
	return `${parts[0][0]}.${parts[1][0]}`.toUpperCase();
}

export function randomString(): string {
	return uuid();
}

/**
 * Generate a stable ID for an element
 *
 * @param {string} name - The name of the element
 * @returns {string} - The generated ID
 */
const idsCache = new Map();

export const generateElementId = (name: string) => {
	if (!idsCache.has(name)) {
		idsCache.set(
			name,
			`id-${name}-${Math.random().toString(36).slice(2, 9)}`,
		);
	}

	return idsCache.get(name);
};

/**
 * Build a query string from an object
 *
 * @param {Record<string, string | number | boolean | undefined | null>} params - The object to build the query string from
 * @returns {string} - The query string
 */
export const buildQueryString = (
	params: Record<string, string | number | boolean | undefined | null>,
): string => {
	const query = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			query.append(key, String(value));
		}
	});

	return query.toString();
};
