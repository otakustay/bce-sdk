import fs from 'node:fs';
import {Readable} from 'node:stream';
import type {Http} from '../shared/index.js';
import {normalizeUrl} from '../utils/string.js';

export interface PutObjectOptions {
    headers?: Record<string, string>;
}

export type ObjectBody = BodyInit;
export type JsonObjectBody = Record<string, unknown>;

export class BosObjectClient {
    private readonly http: Http;
    private readonly objectUrl: string;

    constructor(http: Http, bucketName: string, objectKey: string) {
        this.http = http;
        this.objectUrl = `/v1/${bucketName}/${normalizeUrl(objectKey, false)}`;
    }

    async get() {
        const response = await this.http.text('GET', this.objectUrl);
        return response;
    }

    async getMeta() {
        const response = await this.http.noContent('HEAD', this.objectUrl);
        return response;
    }

    async getAsBlob() {
        const response = await this.http.blob('GET', this.objectUrl);
        return response;
    }

    async getAsStream() {
        const response = await this.http.stream('GET', this.objectUrl);
        return response;
    }

    async put(body: ObjectBody, options?: PutObjectOptions) {
        const response = await this.http.noContent(
            'PUT',
            this.objectUrl,
            {
                body,
                headers: {
                    ...options?.headers,
                },
            }
        );
        return response;
    }

    async putJson(body: JsonObjectBody, options?: PutObjectOptions) {
        const response = await this.http.noContent(
            'PUT',
            this.objectUrl,
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
        const stream = Readable.toWeb(fs.createReadStream(file)) as ReadableStream<Uint8Array>;
        const response = await this.put(stream, options);
        return response;
    }

    async delete() {
        const response = await this.http.noContent('DELETE', this.objectUrl);
        return response;
    }
}
