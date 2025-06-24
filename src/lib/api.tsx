import {ApiError} from '@/lib/exceptions/api.error';

function getBackendApiBaseUrl(): string {
    return process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || '';
}

function getAuthToken(): string {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImlkZW50IjoiMzc4YThlOTEtNzQ3Mi00ZTk0LWJjYTAtZWY1YmM4MjY1YzA3IiwiaWF0IjoxNzQ3NjA4NDcwfQ.xgYG7FRlMY7-2HeWQafTf0w03EGknnoYSd3xtmihze0';
}

export type ResponseFetch<T> = {
    data: T;
    message?: string;
    status?: number;
    success: boolean;
};

export async function doFetch<T = any>(path: string, options: RequestInit = {}, acceptedErrorCodes?: number[]): Promise<ResponseFetch<T> | undefined> {
    const baseUrl = getBackendApiBaseUrl();
    const token = getAuthToken();

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

        checkResponse(res, responseBody, acceptedErrorCodes); // Can throw ApiErr or return `responseBody` depending on the res.status code

        return responseBody;
    } catch (error) {
        clearTimeout(timeout);

        handleError(error);

        return undefined;
    }
}

export function getResponseData<T = any>(response: ResponseFetch<T> | undefined): T | undefined {
    return response?.data;
}

export async function handleJsonResponse(res: Response) {
    try {
        return await res.json();
    } catch {
        if (res.ok)  {
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