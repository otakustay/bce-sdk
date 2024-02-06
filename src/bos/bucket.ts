import {Http} from '../shared/index.js';
import {BosObjectClient, ObjectBody, PutObjectOptions} from './object.js';

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

export class BosBucketClient {
    private readonly http: Http;
    private readonly bucketName: string;

    constructor(http: Http, bucketName: string) {
        this.http = http;
        this.bucketName = bucketName;
    }

    withObject(objectKey: string) {
        return new BosObjectClient(this.http, objectKey);
    }

    async listObjects(options?: ListObjectOptions) {
        const response = await this.http.json<ListObjectResponse>(
            'GET',
            `/v1/${this.bucketName}`,
            {
                params: {
                    delimiter: options?.delimiter,
                    marker: options?.marker,
                    maxKeys: options?.maxKeys,
                    prefix: options?.prefix,
                },
            }
        );
        return response;
    }

    async getObject(key: string) {
        return this.withObject(key).get();
    }

    async getObjectMeta(key: string) {
        return this.withObject(key).getMeta();
    }

    async getObjectAsBlob(key: string) {
        return this.withObject(key).getAsBlob();
    }

    async getObjectAsStream(key: string) {
        return this.withObject(key).getAsStream();
    }

    async putObject(key: string, body: ObjectBody, options?: PutObjectOptions) {
        return this.withObject(key).put(body, options);
    }

    async putObjectFromFile(key: string, file: string, options?: PutObjectOptions) {
        return this.withObject(key).putFromFile(file, options);
    }

    async deleteObject(key: string) {
        return this.withObject(key).delete();
    }
}
