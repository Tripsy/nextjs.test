import {useEffect} from 'react';

export function useLocationReload(condition: boolean) {
    useEffect(() => {
        if (condition) {
            window.location.reload();
        }
    }, [condition]);
}
