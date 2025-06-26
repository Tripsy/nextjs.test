import {ApiError} from '@/lib/exceptions/api.error';
import Routes from '@/lib/routes';
import {getTokenFromCookie} from '@/lib/services/auth.service';

function getBackendApiBaseUrl(): string {
    return process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || '';
}

export async function executeFrontendFetch<T = any>(path: string, options: RequestInit = {}, acceptedErrorCodes?: number[]): Promise<ResponseFetch<T> | undefined> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s

    try {
        const res = await fetch(Routes.get(path), {
            ...options,
            signal: controller.signal,
            headers: {
                ...(options.headers || {}),
                'Content-Type': 'application/json',
            },
        });

        clearTimeout(timeout);

        // Handle non-JSON responses (like 204 No Content)
        if (res.status === 204) {
            return undefined;
        }

        const responseBody = await handleJsonResponse(res);

        checkResponse(res, responseBody, acceptedErrorCodes); // Can throw ApiErr or return `responseBody` depending on the res.status code

        return responseBody;
    } catch (error) {
        clearTimeout(timeout);

        handleError(error);

        return undefined;
    }
}

export type ResponseFetch<T> = {
    data?: T;
    message: string;
    success: boolean;
};

export async function executeBackendFetch<T = any>(path: string, options: RequestInit = {}, acceptedErrorCodes?: number[]): Promise<ResponseFetch<T> | undefined> {
    const baseUrl = getBackendApiBaseUrl();
    const token = await getTokenFromCookie();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s

    try {
        const res = await fetch(`${baseUrl}${path}`, {
            ...options,
            signal: controller.signal,
            headers: {
                ...(options.headers || {}),
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        clearTimeout(timeout);

        // Handle non-JSON responses (like 204 No Content)
        if (res.status === 204) {
            return undefined;
        }

        const responseBody = await handleJsonResponse(res);

        checkResponse(res, responseBody, acceptedErrorCodes); // Can throw ApiError or return `responseBody` depending on the res.status code

        return responseBody;
    } catch (error) {
        clearTimeout(timeout);

        handleError(error);

        return undefined;
    }
}

export function getResponseData<T = any>(response: ResponseFetch<T> | undefined): T | undefined {
    return response?.data as T;
}

export async function handleJsonResponse(res: Response) {
    try {
        return await res.json();
    } catch {
        if (res.ok) {
            throw new Error('Invalid JSON response');
        }

        return null; // Explicitly return null for non-JSON error responses
    }
}

function checkResponse(res: Response, responseBody: any, acceptedErrorCodes: number[] = []) {
    if (!res.ok && !acceptedErrorCodes.includes(res.status)) { // If this condition is not matched the `responseBody` is returned
        throw new ApiError(
            responseBody?.message || res.statusText || 'Unknown error',
            res.status,
            responseBody
        );
    }
}

function handleError(error: unknown) {
    if (error instanceof ApiError) {
        throw error;
    }

    // Handle network errors or aborted requests
    if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, null);
    }

    throw new ApiError(
        error instanceof Error ? error.message : 'Network request failed',
        0,
        null
    );
}