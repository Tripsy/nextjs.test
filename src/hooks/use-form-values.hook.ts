import React, {useEffect, useState} from 'react';
import isEqual from 'fast-deep-equal';

export function useFormValues<T>(
    externalValues: T | undefined,
    defaultValues: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [formValues, setFormValues] = useState<T>(() => ({
        ...defaultValues,
        ...(externalValues || {})
    }));

    useEffect(() => {
        if (externalValues && !isEqual(formValues, externalValues)) {
            setFormValues({...externalValues});
        }
    }, [externalValues]);

    return [formValues, setFormValues];
}
