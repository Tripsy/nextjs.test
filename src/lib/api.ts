import {ApiError} from '@/lib/exceptions/api.error';
import Routes from '@/config/routes';
import {app} from '@/config/settings';

export function getRemoteApiUrl(path: string): string {
    path = path.replace(/^\//, ''); // Remove first / if exist

    return app('remoteApi.url') + '/' + path;
}

export type ResponseFetch<T> = {
    data?: T;
    message: string;
    success: boolean;
};

export function getResponseData<T = any>(response: ResponseFetch<T> | undefined): T | undefined {
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
    private acceptedErrorCodes: number[] = [];

    public setRequestMode(mode: RequestMode): this {
        this.requestMode = mode;

        return this;
    }

    public setRequestInit(options: RequestInit): this { // TODO: this works but may fail depending on how data is provided (eg: Headers Object vs. Object)
        const headers = {
            ...this.requestInit.headers,
            ...options.headers
        };

        this.requestInit = {
            ...this.requestInit,
            ...options,
            headers: headers,
        };

        return this;
    }

    public setAcceptedErrorCodes(codes: number[]): this {
        this.acceptedErrorCodes = codes;

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

    private checkResponse(res: Response, responseBody: any) {
        if (!res.ok && !this.acceptedErrorCodes.includes(res.status)) { // If this condition is not matched the `responseBody` is returned
            throw new ApiError(
                responseBody?.message || res.statusText || 'Unknown error',
                res.status,
                responseBody
            );
        }
    }

    private handleError(error: unknown) {
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

    private buildProxyRoute(path: string) {
        const [rawPath, rawQuery] = path.split('?');

        const routeSegments = rawPath.split('/').filter(Boolean); // eg: filter(Boolean) removes empty segments

        let proxyRoute = Routes.get('proxy', { path: routeSegments });

        if (rawQuery) {
            proxyRoute += `?${rawQuery}`;
        }

        return app('url') + proxyRoute;
    }

    private buildRequestUrl(path: string) {
        switch (this.requestMode) {
            case 'use-proxy':
                return this.buildProxyRoute(path);
            case 'same-site':
                return Routes.get(path);
            case 'remote-api':
                return getRemoteApiUrl(path);
            default:
                return path;
        }
    }

    public async doFetch<T = any>(path: string, requestInit: RequestInit = {}): Promise<ResponseFetch<T> | undefined> {
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

            const responseBody = await this.handleJsonResponse(res);

            this.checkResponse(res, responseBody); // Can throw ApiError or return `responseBody` depending on the res.status code

            return responseBody;
        } catch (error) {
            clearTimeout(timeout);

            this.handleError(error);

            return undefined;
        }
    }
}