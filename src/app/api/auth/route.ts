import {NextRequest, NextResponse} from 'next/server';
import {ResponseFetch} from '@/lib/api';
import {app} from '@/config/settings';

export async function POST(req: NextRequest): Promise<NextResponse<ResponseFetch<null>>> {
    try {
        const {token} = await req.json();

        if (!token) {
            return NextResponse.json({
                data: null,
                message: 'No token provided',
                success: false
            }, {status: 400});
        }

        const response = NextResponse.json({
            data: null,
            message: 'Session set successfully',
            success: true
        });

        response.cookies.set(app('user.sessionToken'), token, {
            httpOnly: true,
            secure: app('environment') === 'production',
            path: '/',
            sameSite: 'lax',
            maxAge: app('user.sessionMaxAge'),
        });

        return response;
    } catch (error) {
        return NextResponse.json({
            data: null,
            message: 'Invalid request body',
            success: false
        }, {status: 400});
    }
}

export async function DELETE(): Promise<NextResponse<ResponseFetch<null>>> {
    const response = NextResponse.json({
        data: null,
        message: 'Session cleared',
        success: true
    });

    response.cookies.delete(app('user.sessionToken'));

    return response;
}