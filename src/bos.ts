import type {ReadStream} from 'node:fs';
import {Http} from './http.js';
import {RegionClientOptions} from './interface.js';

// https://cloud.baidu.com/doc/BOS/s/Rjwvysdnp

export interface ListObjectOptions {
    delimiter?: string;
    marker?: string;
    maxKeys?: number;
    prefix?: string;
}

export interface ObjectOwner {
    id: string;
    displayName: string;
}

export interface ObjectContent {
    key: string;
    lastModified: string;
    eTag: string;
    size: number;
    storageClass: 'STANDARD' | 'COLD';
    owner: ObjectOwner;
}

export interface CommonPrefix {
    prefix: string;
}

export interface ListObjectResponse {
    name: string;
    prefix: string;
    delimiter: string;
    commonPrefixes?: CommonPrefix[];
    isTruncated: boolean;
    maxKeys: number;
    marker: string;
    nextMarker: string;
    contents: ObjectContent[];
}

export interface PutObjectOptions {
    headers?: Record<string, string>;
}

export type ObjectBody = string | Blob | ArrayBuffer | ReadStream;

export type BosOptions = RegionClientOptions;

export class BosClient {
    private readonly hostBase: string;
    private readonly http: Http;

    constructor(options: BosOptions) {
        this.hostBase = `${options.region}.bcebos.com`;
        this.http = Http.fromEndpoint(this.hostBase, options);
    }

    async listObjects(bucketName: string, options?: ListObjectOptions) {
        const response = await this.http.json<ListObjectResponse>(
            'GET',
            '/',
            {
                params: {
                    delimiter: options?.delimiter,
                    marker: options?.marker,
                    maxKeys: options?.maxKeys,
                    prefix: options?.prefix,
                },
                headers: {
                    'content-type': 'application/json',
                    host: `${bucketName}.${this.hostBase}`,
                },
            }
        );
        return response;
    }

    async getObject(bucketName: string, key: string) {
        const response = await this.http.text(
            'GET',
            `/${key}`,
            {headers: {host: `${bucketName}.${this.hostBase}`}}
        );
        return response;
    }

    async getObjectAsBlob(bucketName: string, key: string) {
        const response = await this.http.blob(
            'GET',
            `/${key}`,
            {headers: {host: `${bucketName}.${this.hostBase}`}}
        );
        return response;
    }

    async getObjectAsStream(bucketName: string, key: string) {
        const response = await this.http.stream(
            'GET',
            `/${key}`,
            {headers: {host: `${bucketName}.${this.hostBase}`}}
        );
        return response;
    }

    async putObject(bucketName: string, key: string, body: ObjectBody, options?: PutObjectOptions) {
        const response = await this.http.noContent(
            'PUT',
            `/${key}`,
            {
                body,
                headers: {
                    ...options?.headers,
                    host: `${bucketName}.${this.hostBase}`,
                },
            }
        );
        return response;
    }

    async putObjectFromFile(bucketName: string, key: string, file: string, options?: PutObjectOptions) {
        const fs = await import('node:fs');
        const stream = fs.createReadStream(file);
        const response = await this.putObject(bucketName, key, stream, options);
        return response;
    }

    async deleteObject(bucketName: string, key: string) {
        const response = await this.http.noContent(
            'DELETE',
            `/${key}`,
            {headers: {host: `${bucketName}.${this.hostBase}`}}
        );
        return response;
    }
}
