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

        let responseBody: any;

        try {
            responseBody = await res.json();
        } catch (err) {
            // Handle cases where response isn't JSON
            if (res.ok) {
                throw new ApiError('Invalid JSON response', res.status, null);
            }
        }

        if (!res.ok) {
            throw new ApiError(
                responseBody?.message || res.statusText || 'Unknown error',
                res.status,
                responseBody
            );
        }

        return responseBody?.data !== undefined ? responseBody.data : responseBody;
    } catch (error) {
        clearTimeout(timeout);

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
}
