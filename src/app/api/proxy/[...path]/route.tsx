'use server';

import {NextRequest, NextResponse} from 'next/server';
import {buildBackendApiUrl} from '@/lib/api';
import {getClientIp, getTokenFromCookie} from '@/lib/utils/system';

async function handler(req: NextRequest, path: string[]) {
    const token = await getTokenFromCookie();
    const url = buildBackendApiUrl(path.join('/'));

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        'User-Agent': req.headers.get('user-agent') || '',
        'Accept-Language': req.headers.get('accept-language') || '',
        'X-Client-IP': getClientIp(req),
        'X-Client-OS': req.headers.get('x-client-os') || '',
    };

    const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.text();

    const backendRes = await fetch(url, {
        method: req.method,
        headers,
        body,
        next: {revalidate: 0}, // Do not cache
    });

    const contentType = backendRes.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await backendRes.json() : await backendRes.text();

    return new NextResponse(
        isJson ? JSON.stringify(data) : data,
        {
            status: backendRes.status,
            headers: {'Content-Type': contentType},
        }
    );
}

type Params = { params: { path: string[] } };

// Generic handler for all methods
async function handleRequest(req: NextRequest, {params}: Params) {
    // Type assertion to satisfy TypeScript while following Next.js convention https://nextjs.org/docs/messages/sync-dynamic-apis
    const {path} = await (params as unknown as Promise<{ path: string[] }>);

    return handler(req, path);
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;