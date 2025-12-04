import {Http} from '../shared/index.js';
import type {RegionClientOptions} from '../shared/index.js';
import {BosBucketClient} from './bucket.js';
import type {ListObjectOptions} from './bucket.js';
import type {ObjectBody, PutObjectOptions} from './object.js';

export type {ObjectBody, PutObjectOptions, BosObjectClient} from './object.js';
export type {
    CommonPrefix,
    ListObjectOptions,
    ListObjectResponse,
    ObjectContent,
    ObjectOwner,
    BosBucketClient,
} from './bucket.js';

export type BosOptions = RegionClientOptions;

export class BosClient {
    protected readonly http: Http;

    constructor(options: BosOptions) {
        this.http = Http.fromEndpoint(`${options.region}.bcebos.com`, options);
    }

    withBucket(bucketName: string) {
        return new BosBucketClient(this.http, bucketName);
    }

    withObject(bucketName: string, objectKey: string) {
        return this.withBucket(bucketName).withObject(objectKey);
    }

    /**
     * @see https://cloud.baidu.com/doc/BOS/s/bkcacfjvi
     */
    async listObjects(bucketName: string, options?: ListObjectOptions) {
        return this.withBucket(bucketName).listObjects(options);
    }

    /**
     * @see https://cloud.baidu.com/doc/BOS/s/xkc5pcmcj
     */
    async getObject(bucketName: string, key: string) {
        return this.withObject(bucketName, key).get();
    }

    /**
     * @see https://cloud.baidu.com/doc/BOS/s/xkc5pcmcj
     */
    async getObjectAsBlob(bucketName: string, key: string) {
        return this.withObject(bucketName, key).getAsBlob();
    }

    /**
     * @see https://cloud.baidu.com/doc/BOS/s/xkc5pcmcj
     */
    async getObjectAsStream(bucketName: string, key: string) {
        return this.withObject(bucketName, key).getAsStream();
    }

    /**
     * @see https://cloud.baidu.com/doc/BOS/s/6kc5suqj3
     */
    async getObjectMeta(bucketName: string, key: string) {
        return this.withObject(bucketName, key).getMeta();
    }

    /**
     * @see https://cloud.baidu.com/doc/BOS/s/Ikc5nv3wc
     */
    async putObject(bucketName: string, key: string, body: ObjectBody, options?: PutObjectOptions) {
        return this.withObject(bucketName, key).put(body, options);
    }

    /**
     * @see https://cloud.baidu.com/doc/BOS/s/Ikc5nv3wc
     */
    async putObjectFromFile(bucketName: string, key: string, file: string, options?: PutObjectOptions) {
        return this.withObject(bucketName, key).putFromFile(file, options);
    }

    /**
     * @see https://cloud.baidu.com/doc/BOS/s/bkc5tsslq
     */
    async deleteObject(bucketName: string, key: string) {
        return this.withObject(bucketName, key).delete();
    }
}
