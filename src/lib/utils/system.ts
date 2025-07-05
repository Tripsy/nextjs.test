import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {app} from '@/config/settings';
import {AuthModel} from '@/lib/models/auth.model';
import {ResponseFetch} from '@/lib/api';

export function getClientIp(req: NextRequest): string | undefined {
    // 1. First try x-forwarded-for header (common in proxies)
    const forwardedIp = req.headers.get('x-forwarded-for');

    // Extract the first IP from x-forwarded-for if exists
    let ip = forwardedIp
        ? forwardedIp.split(',')[0].trim()
        : req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip');

    if (!ip) {
        return undefined;
    }

    // Remove IPv6 prefix
    ip = ip.replace(/^::ffff:/, '');

    // Remove port number if exists
    ip = ip.split(':')[0];

    // Remove brackets from IPv6 addresses
    ip = ip.replace(/^\[|\]$/g, '');

    return ip;
}

export async function getSessionToken(): Promise<string | undefined> {
    const cookieStore = await cookies();

    return cookieStore.get(app('user.sessionToken'))?.value;
}

export function appendSessionToken<T = unknown>(res: NextResponse<T>, token: string | undefined): NextResponse<T> {
    if (token) {
        res.cookies.set(app('user.sessionToken'), token, {
            httpOnly: true,
            secure: app('environment') === 'production',
            path: '/',
            sameSite: 'lax',
            maxAge: app('user.sessionMaxAge'),
        });
    }

    return res;
}

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
        'X-Client-IP': getClientIp(req) || '',
        'X-Client-OS': req.headers.get('x-client-os') || '',
    };
}