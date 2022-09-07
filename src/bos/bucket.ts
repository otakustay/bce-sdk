import {Http} from '../shared/index.js';
import {BosObjectClient} from './object.js';

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

    constructor(http: Http, hostBase: string, bucketName: string) {
        this.http = http.withHeaders({host: `${bucketName}.${hostBase}`});
    }

    withObject(objectKey: string) {
        return new BosObjectClient(this.http, objectKey);
    }

    async listObjects(options?: ListObjectOptions) {
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
            }
        );
        return response;
    }
}
