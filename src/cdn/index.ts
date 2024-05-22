import { Http } from "../shared/http.js";

export interface CdnCredential {
    ak: string;
    sk: string;
}

export interface CdnOptions {
    credentials: CdnCredential;
    sessionToken?: string;
}

export interface PrefetchTask {
    url: string;
    startTime?: string;
}

export interface PrefetchResponseDto {
    id: string;
}

export interface StdHttpException {
    statusCode: number;
    body: {
        code: string;
        message: string;
    };
}

class HttpException extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class CdnClient {
    private readonly http: Http;
    constructor(options: CdnOptions) {
        this.http = Http.fromEndpoint('cdn.baidubce.com', options);
    }
    async prefetch(tasks: PrefetchTask[]): Promise<PrefetchResponseDto> {
        try {
            const res = await this.http.json<PrefetchResponseDto>('POST', '/v2/cache/prefetch', {
                body: {
                    'tasks': tasks,
                },
            });
            return res.body;
        } catch (error) {
            const exception = error as StdHttpException;
            if (exception.statusCode === 400) {
                throw new HttpException(
                    'Invalid url or startTime is not within the next 24 hours',
                    500,
                );
            } else {
                throw new HttpException(exception.body.message, 500);
            }
        }
    }
}
