import {RegionClientOptions, Http} from '../shared/index.js';
import {BosBucketClient, ListObjectOptions} from './bucket.js';
import {ObjectBody, PutObjectOptions} from './object.js';

export type {ObjectBody, PutObjectOptions, BosObjectClient} from './object.js';
export type {
    CommonPrefix,
    ListObjectOptions,
    ListObjectResponse,
    ObjectContent,
    ObjectOwner,
    BosBucketClient,
} from './bucket.js';

// https://cloud.baidu.com/doc/BOS/s/Rjwvysdnp

export type BosOptions = RegionClientOptions;

export class BosClient {
    protected readonly hostBase: string;
    protected readonly http: Http;

    constructor(options: BosOptions) {
        this.hostBase = `${options.region}.bcebos.com`;
        this.http = Http.fromEndpoint(this.hostBase, options);
    }

    withBucket(bucketName: string) {
        return new BosBucketClient(this.http, this.hostBase, bucketName);
    }

    withObject(bucketName: string, objectKey: string) {
        return this.withBucket(bucketName).withObject(objectKey);
    }

    async listObjects(bucketName: string, options?: ListObjectOptions) {
        return this.withBucket(bucketName).listObjects(options);
    }

    async getObject(bucketName: string, key: string) {
        return this.withObject(bucketName, key).get();
    }

    async getObjectAsBlob(bucketName: string, key: string) {
        return this.withObject(bucketName, key).getAsBlob();
    }

    async getObjectAsStream(bucketName: string, key: string) {
        return this.withObject(bucketName, key).getAsStream();
    }

    async putObject(bucketName: string, key: string, body: ObjectBody, options?: PutObjectOptions) {
        return this.withObject(bucketName, key).put(body, options);
    }

    async putObjectFromFile(bucketName: string, key: string, file: string, options?: PutObjectOptions) {
        return this.withObject(bucketName, key).putFromFile(file, options);
    }

    async deleteObject(bucketName: string, key: string) {
        return this.withObject(bucketName, key).delete();
    }
}
