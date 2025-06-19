import {ApiError} from '@/lib/exceptions/api.error';

function getBackendApiBaseUrl(): string {
    return process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || '';
}

function getAuthToken(): string {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImlkZW50IjoiMzc4YThlOTEtNzQ3Mi00ZTk0LWJjYTAtZWY1YmM4MjY1YzA3IiwiaWF0IjoxNzQ3NjA4NDcwfQ.xgYG7FRlMY7-2HeWQafTf0w03EGknnoYSd3xtmihze0';
}

export async function fetchData<T = any>(path: string, options: RequestInit = {}): Promise<T> {
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
            return undefined as unknown as T;
        }

        const responseBody = await handleJsonResponse(res);

        checkResponse(res, responseBody);

        return responseBody?.data !== undefined ? responseBody.data : responseBody;
    } catch (error) {
        clearTimeout(timeout);

        handleError(error);

        return undefined as unknown as T;
    }
}

async function handleJsonResponse(res: Response) {
    try {
        return await res.json();
    } catch {
        if (res.ok)  {
            throw new Error('Invalid JSON response');
        }

        return null; // Explicitly return null for non-JSON error responses
    }
}

function checkResponse(res: Response, responseBody: any) {
    if (!res.ok) {
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