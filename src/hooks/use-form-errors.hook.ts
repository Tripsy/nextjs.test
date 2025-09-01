import React, {useEffect, useState} from 'react';
import isEqual from 'fast-deep-equal';

export function useFormErrors<T>(externalErrors: T | undefined): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [errors, setErrors] = useState<T>(() => (externalErrors ?? {} as T));

    useEffect(() => {
        if (externalErrors && !isEqual(errors, externalErrors)) {
            setErrors({...externalErrors});
        }
    }, [externalErrors]);

    return [errors, setErrors];
}
