import {useState, useCallback} from 'react';
import {useDebouncedEffect} from '@/hooks/use-debounced-effect.hook';
import {ZodError} from 'zod';

interface UseFormValidationProps<T> {
    values: T;
    validate: (values: T) => { success: boolean; error?: ZodError<T> };
    debounceDelay?: number;
}

export function useFormValidation<T extends Record<string, unknown>>({
    values,
    validate,
    debounceDelay = 800,
}: UseFormValidationProps<T>) {
    const [errors, setErrors] = useState<Partial<Record<keyof T, string[]>>>({});
    const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof T, boolean>>>({});
    const [submitted, setSubmitted] = useState(false);

    const markFieldAsTouched = useCallback((field: keyof T) => {
        setTouchedFields(prev => ({...prev, [field]: true}));
    }, []);

    const markAllFieldsAsTouched = useCallback(() => {
        const allTouched = Object.keys(values).reduce((acc, key) => {
            acc[key as keyof T] = true;
            return acc;
        }, {} as Partial<Record<keyof T, boolean>>);

        setTouchedFields(allTouched);
    }, [values]);

    const isSubmitted = useCallback((status: boolean) => {
        setSubmitted(status);
    }, []);

    useDebouncedEffect(() => {
        const fieldsToValidate = submitted
            ? values
            : Object.keys(touchedFields).reduce((acc, key) => {
                acc[key as keyof T] = values[key as keyof T];
                return acc;
            }, {} as Partial<T>);

        if (Object.keys(fieldsToValidate).length > 0) {
            const validated = validate(values);

            if (validated.success) {
                setErrors({});
            } else {
                const fieldErrors = (validated.error?.flatten().fieldErrors || {}) as Partial<Record<keyof T, string[]>>;

                const filteredErrors = submitted ? fieldErrors :
                    (Object.keys(fieldErrors) as (keyof T)[])
                        .filter(key => touchedFields[key])
                        .reduce((acc, key) => {
                            acc[key] = fieldErrors[key]; // ✅ now TS is happy
                            return acc;
                        }, {} as Partial<Record<keyof T, string[]>>);


                setErrors(filteredErrors);
            }
        }
    }, [values, touchedFields, submitted, validate], debounceDelay);

    return {
        errors,
        setErrors,
        submitted,
        isSubmitted,
        touchedFields,
        markFieldAsTouched,
        markAllFieldsAsTouched
    };
}