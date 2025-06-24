export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public response: any
    ) {
        super(message);
        this.name = 'ApiError';

        // Maintain proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }
}