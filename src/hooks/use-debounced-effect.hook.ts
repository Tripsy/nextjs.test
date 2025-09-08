import {DependencyList, useEffect} from 'react';

export function useDebouncedEffect(
    effect: () => void,
    deps: DependencyList,
    delay: number
) {
    useEffect(() => {
        const handler = setTimeout(() => effect(), delay);

        return () => clearTimeout(handler);
    }, [deps, delay, effect]);
}
