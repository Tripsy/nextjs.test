import {TableFetchResponseType} from '@/app/dashboard/components/table-list.component';

function getBackendApiBaseUrl(): string {
    return process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || '';
}

function getAuthToken(): string {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImlkZW50IjoiMzc4YThlOTEtNzQ3Mi00ZTk0LWJjYTAtZWY1YmM4MjY1YzA3IiwiaWF0IjoxNzQ3NjA4NDcwfQ.xgYG7FRlMY7-2HeWQafTf0w03EGknnoYSd3xtmihze0';
}

export async function fetchData(path: string, options: RequestInit = {}): Promise<TableFetchResponseType> {
    const baseUrl = getBackendApiBaseUrl();

    const token = getAuthToken();

    const res = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    let responseBody: any;

    try {
        responseBody = await res.json();
    } catch (err) {
        // Handle cases where response isn't JSON
        if (res.ok) {
            throw new Error('Invalid JSON response');
        }

        responseBody = null;
    }

    if (!res.ok) {
        const message = responseBody?.message || res.statusText || 'Unknown error';
        const error = new Error(`Request failed: ${message}`);

        (error as any).status = res.status;
        (error as any).response = responseBody;

        throw error;
    }

    if (!responseBody?.data) {
        throw new Error('Invalid API response structure');
    }

    return {
        entries: responseBody?.data.entries || [],
        pagination: responseBody?.data.pagination || {
            page: 1,
            limit: 10,
            total: 0
        },
    };
}
