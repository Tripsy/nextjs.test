import {cookies} from 'next/headers';
import {NextRequest} from 'next/server';

export async function getTokenFromCookie(): Promise<string | undefined> {
    const SESSION_COOKIE_NAME: string = process.env.SESSION_COOKIE_NAME || 'session';

    const cookieStore = await cookies();

    return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export function getClientIp(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    return req.headers.get('x-real-ip') || '';
}