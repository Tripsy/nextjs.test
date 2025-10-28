import isEqual from 'fast-deep-equal';
import { useCallback, useRef, useState } from 'react';
import type { ZodError } from 'zod';
import { useDebouncedEffect } from '@/hooks/use-debounced-effect.hook';

interface UseFormValidationProps<K> {
	formValues: K;
	validate: (values: K) => { success: boolean; error?: ZodError<K> };
	debounceDelay?: number;
}

export function useFormValidation<T extends Record<string, unknown>>({
	formValues,
	validate,
	debounceDelay = 800,
}: UseFormValidationProps<T>) {
	const [errors, setErrors] = useState<Partial<Record<keyof T, string[]>>>(
		{},
	);
	const [touchedFields, setTouchedFields] = useState<
		Partial<Record<keyof T, boolean>>
	>({});
	const [submitted, setSubmitted] = useState(false);

	const prevValuesRef = useRef<T>(formValues);
	const prevTouchedRef = useRef(touchedFields);
	const prevSubmittedRef = useRef(submitted);

	const markFieldAsTouched = useCallback((field: keyof T) => {
		setTouchedFields((prev) =>
			prev[field] ? prev : { ...prev, [field]: true },
		);
	}, []);

	useDebouncedEffect(
		() => {
			const valuesChanged = !isEqual(prevValuesRef.current, formValues);
			const touchedChanged = !isEqual(
				prevTouchedRef.current,
				touchedFields,
			);
			const submittedChanged = prevSubmittedRef.current !== submitted;

			// Reset submitted if values changed
			if (submitted && valuesChanged) {
				setSubmitted(false);
			}

			const shouldValidate =
				submitted || Object.keys(touchedFields).length > 0;

			prevValuesRef.current = formValues;
			prevTouchedRef.current = touchedFields;
			prevSubmittedRef.current = submitted;

			// Check if we should run validation
			if (
				!shouldValidate ||
				(!valuesChanged && !touchedChanged && !submittedChanged)
			) {
				return;
			}

			// Calculate fields to validate
			const fieldsToValidate = submitted
				? formValues
				: Object.keys(touchedFields).reduce(
						(acc, key) => {
							if (touchedFields[key as keyof T]) {
								acc[key as keyof T] =
									formValues[key as keyof T];
							}
							return acc;
						},
						{} as Partial<T>,
					);

			if (Object.keys(fieldsToValidate).length === 0) {
				return;
			}

			const validated = validate(formValues);

			if (validated.success) {
				setErrors({});
			} else {
				const fieldErrors = (validated.error?.flatten().fieldErrors ||
					{}) as Partial<Record<keyof T, string[]>>;

				const filteredErrors = submitted
					? fieldErrors
					: (Object.keys(fieldErrors) as (keyof T)[])
							.filter((key) => touchedFields[key])
							.reduce(
								(acc, key) => {
									acc[key] = fieldErrors[key]; // ✅ now TS is happy
									return acc;
								},
								{} as Partial<Record<keyof T, string[]>>,
							);

				setErrors(filteredErrors);
			}
		},
		[formValues, touchedFields, submitted, validate],
		debounceDelay,
	);

	return {
		errors,
		setErrors,
		submitted,
		setSubmitted,
		touchedFields,
		markFieldAsTouched,
	};
}
