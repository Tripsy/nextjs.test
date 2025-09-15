import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

export function useLocationReload(condition: boolean) {
    const router = useRouter();

    useEffect(() => {
        if (condition) {
            router.refresh();
        }
    }, [condition, router]);
}
