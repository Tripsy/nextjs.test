import React, {useEffect, useState, useRef} from 'react';
import isEqual from 'fast-deep-equal';

export function useFormValues<T>(
    stateValues: T | undefined,
    defaultValues: T
): [T, React.Dispatch<React.SetStateAction<T>>] {

    const [formValues, setFormValues] = useState<T>(() => ({
        ...defaultValues,
        ...(stateValues || {})
    }));

    const prevExternalValuesRef = useRef<T | undefined>(stateValues);

    useEffect(() => {
        if (stateValues && !isEqual(prevExternalValuesRef.current, stateValues)) {
            setFormValues({...stateValues});

            prevExternalValuesRef.current = stateValues;
        }
    }, [stateValues]);

    return [formValues, setFormValues];
}