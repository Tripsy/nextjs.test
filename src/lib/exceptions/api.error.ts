import {ResponseFetch} from '@/lib/api';

export class ApiError extends Error {
    public response: ResponseFetch<unknown>;

    constructor(
        message: string,
        public status: number
    ) {
        super(message);
        this.name = 'ApiError';
        this.status = status;

        // Maintain proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }
}