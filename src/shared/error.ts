export class RequestError extends Error {
    readonly statusCode: number;
    readonly headers: Record<string, string>;
    readonly body: string;

    constructor(statusCode: number, headers: Record<string, string>, body: string) {
        super(`Request failed with status code ${statusCode}`);
        this.statusCode = statusCode;
        this.headers = headers;
        this.body = body;
    }
}

export const isRequestError = (error: unknown): error is RequestError => error instanceof RequestError;
