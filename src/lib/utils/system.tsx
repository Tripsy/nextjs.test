import {cookies} from 'next/headers';

export async function getTokenFromCookie(): Promise<string | undefined> {
    const cookieStore = await cookies();

    return cookieStore.get('session')?.value;
}