import {NextRequest, NextResponse} from 'next/server';
import {ResponseFetch} from '@/lib/api';

const SESSION_COOKIE_NAME: string = process.env.SESSION_COOKIE_NAME || 'session';
const SESSION_MAX_AGE: number = 60 * Number(process.env.SESSION_MAX_AGE || 10800);

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

        response.cookies.set(SESSION_COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
            maxAge: SESSION_MAX_AGE,
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

// // TODO: not used yet, should be expanded to get user data
// export async function GET(req: NextRequest): Promise<NextResponse<ResponseFetch<{ token: string | null }>>> {
//     const token = req.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
//
//     return NextResponse.json({
//         data: {
//             token: token
//         },
//         message: token ? 'Session found' : 'Error retrieving session',
//         success: !!token
//     });
// }

// TODO: not used yet, useful for logout
export async function DELETE(): Promise<NextResponse<ResponseFetch<null>>> {
    const response = NextResponse.json({
        data: null,
        message: 'Session cleared',
        success: true
    });

    response.cookies.delete(SESSION_COOKIE_NAME);

    return response;
}