import {ApiError} from '@/lib/exceptions/api.error';
import Routes from '@/config/routes';
import {cfg} from '@/config/settings';

export function getRemoteApiUrl(path: string): string {
    path = path.replace(/^\//, ''); // Remove first `/` if exist

    return cfg('remoteApi.url') + '/' + path;
}

export type ResponseFetch<T> = {
    data?: T;
    message: string;
    success: boolean;
} | undefined;

export function getResponseData<T>(response: ResponseFetch<T>): T | undefined {
    return response?.data as T;
}

export type RequestMode = 'same-site' | 'use-proxy' | 'remote-api' | 'custom';

export class ApiRequest {
    static readonly ABORT_TIMEOUT: number = 10000; // 10s

    private requestInit: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    private requestMode: RequestMode = 'use-proxy';

    public setRequestMode(mode: RequestMode): this {
        this.requestMode = mode;

        return this;
    }

    public setRequestInit(options: RequestInit): this {
        const mergedHeaders = new Headers(this.requestInit.headers || {});

        if (options.headers) {
            const incomingHeaders = new Headers(options.headers);

            incomingHeaders.forEach((value, key) => {
                mergedHeaders.set(key, value);
            });
        }

        this.requestInit = {
            ...this.requestInit,
            ...options,
            headers: mergedHeaders,
        };

        return this;
    }

    private async handleJsonResponse(res: Response) {
        try {
            return await res.json();
        } catch {
            if (res.ok) {
                throw new Error('Invalid JSON response');
            }

            return null; // Explicitly return null for non-JSON error responses
        }
    }

    private handleError(error: unknown) {
        if (error instanceof ApiError) {
            throw error;
        }

        // Handle network errors or aborted requests
        if (error instanceof Error && error.name === 'AbortError') {
            throw new ApiError('Request timeout', 408);
        }

        throw new ApiError(error instanceof Error ? error.message : 'Network request failed', 0);
    }

    private buildProxyRoute(path: string) {
        const [rawPath, rawQuery] = path.split('?');

        const routeSegments = rawPath.split('/').filter(Boolean); // eg: filter(Boolean) removes empty segments

        let proxyRoute = Routes.get('proxy', { path: routeSegments });

        if (rawQuery) {
            proxyRoute += `?${rawQuery}`;
        }

        return cfg('url') + proxyRoute;
    }

    private buildRequestUrl(path: string) {
        switch (this.requestMode) {
            case 'use-proxy':
                return this.buildProxyRoute(path);
            case 'same-site':
                return cfg('url') + Routes.get(path);
            case 'remote-api':
                return getRemoteApiUrl(path);
            default:
                return path;
        }
    }

    public async doFetch<T>(path: string, requestInit: RequestInit = {}): Promise<ResponseFetch<T>> {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), ApiRequest.ABORT_TIMEOUT);

        const requestUrl = this.buildRequestUrl(path);

        if (requestInit) {
            this.setRequestInit(requestInit);
        }

        try {
            const res = await fetch(requestUrl, {
                ...this.requestInit,
                signal: controller.signal,
            });

            clearTimeout(timeout);

            // Handle non-JSON responses (like 204 No Content)
            if (res.status === 204) {
                return undefined;
            }

            return await this.handleJsonResponse(res);
        } catch (error) {
            clearTimeout(timeout);

            this.handleError(error);

            return undefined;
        }
    }
}