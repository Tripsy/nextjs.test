import React, {useEffect, useState, useRef} from 'react';
import isEqual from 'fast-deep-equal';

export function useFormValues<T>(
    stateValues: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [formValues, setFormValues] = useState<T>(() => (stateValues));

    const prevExternalValuesRef = useRef<T>(stateValues);

    useEffect(() => {
        if (stateValues && !isEqual(prevExternalValuesRef.current, stateValues)) {
            setFormValues({...stateValues});

            prevExternalValuesRef.current = stateValues;
        }
    }, [stateValues]);

    return [formValues, setFormValues];
}