import type { z } from 'zod';

export function accumulateZodErrors<T>(
	zodError: z.ZodError,
): Partial<Record<keyof T, string[]>> {
	const fieldErrors: Partial<Record<keyof T, string[]>> = {};

	for (const issue of zodError.issues) {
		const fieldPath = issue.path.join('.') as keyof T;

		if (!fieldErrors[fieldPath]) {
			fieldErrors[fieldPath] = [];
		}

		fieldErrors[fieldPath].push(issue.message);
	}

	return fieldErrors;
}

export function getNestedError<T>(
	errors: Partial<Record<keyof T, string[]>>,
	path: string,
): string[] | undefined {
	return errors[path as keyof T];
}
