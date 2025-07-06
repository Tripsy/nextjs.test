import {NextRequest, NextResponse} from 'next/server';
import {ApiRequest, ResponseFetch} from '@/lib/api';
import {app} from '@/config/settings';
import {AuthModel, handleAuthResponse} from '@/lib/models/auth.model';
import {ApiError} from '@/lib/exceptions/api.error';
import {appendSessionToken, forwardedHeaders, getSessionToken, removeSessionToken} from '@/lib/utils/system';

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

        return appendSessionToken(response, token);
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

export async function GET(req: NextRequest): Promise<NextResponse<ResponseFetch<AuthModel>>> {
    try {
        const sessionToken = await getSessionToken();

        if (!sessionToken) {
            return NextResponse.json({
                data: null,
                message: 'Could not retrieve auth model',
                success: false
            }, {status: 401});
        }

        const fetchResponse: ResponseFetch<AuthModel> | undefined = await new ApiRequest()
            .setRequestMode('remote-api')
            .doFetch('/account/details', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${sessionToken}`,
                    ...forwardedHeaders(req)
                }
            });

        const authModel = handleAuthResponse(fetchResponse);

        if (authModel) {
            const response = NextResponse.json({
                data: authModel,
                message: 'Ok',
                success: true
            });

            return appendSessionToken(response, sessionToken); // This will actually refresh the session token
        } else {
            const response = NextResponse.json({
                data: null,
                message: 'Could not retrieve auth model',
                success: false
            }, {status: 401});

            return removeSessionToken(response);
        }
    } catch (error: unknown) {
        if (error instanceof ApiError) {
            return NextResponse.json({
                data: null,
                message: error.message,
                success: false
            }, {status: error.status});
        }

        return NextResponse.json({
            data: null,
            message: error instanceof Error ? error.message : 'Could not retrieve auth model (eg: unknown error)',
            success: false
        }, {status: 500});
    }
}