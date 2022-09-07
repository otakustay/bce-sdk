import fs from 'node:fs';
import {Readable} from 'node:stream';
import {Http} from '../shared/index.js';

export interface PutObjectOptions {
    headers?: Record<string, string>;
}

export type ObjectBody = string | Blob | ArrayBuffer | Readable;

export class BosObjectClient {
    private readonly http: Http;
    private readonly objectKey: string;

    constructor(http: Http, objectKey: string) {
        this.http = http;
        this.objectKey = objectKey;
    }

    async get() {
        const response = await this.http.text('GET', `/${this.objectKey}`);
        return response;
    }

    async getAsBlob() {
        const response = await this.http.blob('GET', `/${this.objectKey}`);
        return response;
    }

    async getAsStream() {
        const response = await this.http.stream('GET', `/${this.objectKey}`);
        return {
            headers: response.headers,
            // @ts-expect-error 都是`WebStream`，只是Node的类型不兼容，实际是能用的
            body: Readable.fromWeb(response.body),
        };
    }

    async put(body: ObjectBody, options?: PutObjectOptions) {
        const response = await this.http.noContent(
            'PUT',
            `/${this.objectKey}`,
            {
                body,
                headers: {
                    ...options?.headers,
                },
            }
        );
        return response;
    }

    async putFromFile(file: string, options?: PutObjectOptions) {
        const stream = fs.createReadStream(file);
        const response = await this.put(stream, options);
        return response;
    }

    async delete() {
        const response = await this.http.noContent('DELETE', `/${this.objectKey}`);
        return response;
    }
}
