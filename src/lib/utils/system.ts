import {NextRequest} from 'next/server';
import {cookies} from 'next/headers';
import {app} from '@/config/settings';

export function getClientIp(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    return req.headers.get('x-real-ip') || '';
}

export async function getSessionToken(): Promise<string | undefined> {
    const cookieStore = await cookies();

    return cookieStore.get(app('user.sessionToken'))?.value;
}

//
// export function getSessionTokenFromRequest(req: NextRequest): string | undefined {
//     return req.cookies.get(app('user.sessionToken'))?.value;
// }

type ForwardedHeaders = {
    'User-Agent': string;
    'Accept-Language': string;
    'X-Client-IP': string;
    'X-Client-OS': string;
};

export function forwardedHeaders(req: NextRequest): ForwardedHeaders {
    return {
        'User-Agent': req.headers.get('user-agent') || '',
        'Accept-Language': req.headers.get('accept-language') || '',
        'X-Client-IP': getClientIp(req),
        'X-Client-OS': req.headers.get('x-client-os') || '',
    };
}