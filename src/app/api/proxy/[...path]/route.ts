'use server';

import {NextRequest, NextResponse} from 'next/server';
import {getRemoteApiUrl} from '@/lib/utils/api';
import {apiHeaders} from '@/lib/utils/system';
import {getCookie} from '@/lib/utils/session';
import {cfg} from '@/config/settings';

async function handler(request: NextRequest, path: string[]) {
    const token = await getCookie(cfg('user.sessionToken'));
    const baseUrl = getRemoteApiUrl(path.join('/'));
    const url = `${baseUrl}${request.nextUrl.search || ''}`;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...await apiHeaders(request.headers),
    };

    const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text();

    const backendRes = await fetch(url, {
        method: request.method,
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