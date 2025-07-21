import {cookies} from 'next/headers';
import {csrfCookieName, csrfInputName, fetchCsrfToken} from '@/lib/csrf';

export async function csrf() {
    const cookieStore = await cookies();

    const csrfToken = cookieStore.get(csrfCookieName)?.value || await fetchCsrfToken();

    return (
        <input type="hidden" name={csrfInputName} value={csrfToken} />
    );
}