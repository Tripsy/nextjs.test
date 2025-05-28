import {NextResponse} from 'next/server';
import Routes from '@/lib/routes';

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public response: any
    ) {
        super(message);
        this.name = 'ApiError';

        if (this.status === 401) {
            throw NextResponse.redirect(Routes.get('login'));
        }

        // Maintain proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }
}