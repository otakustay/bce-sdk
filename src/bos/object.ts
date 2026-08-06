import fs from 'node:fs';
import {Readable} from 'node:stream';
import type {Http} from '../shared/index.js';
import {normalizeUrl} from '../utils/string.js';

export type BosStorageClass = 'STANDARD' | 'STANDARD_IA' | 'COLD' | 'ARCHIVE' | 'MAZ_STANDARD_IA' | 'MAZ_STANDARD';

export type CopyObjectMetadataDirective = 'copy' | 'replace' | 'update';

export type CopyObjectTaggingDirective = 'Copy' | 'Replace';

export interface PutObjectOptions {
    headers?: Record<string, string>;
}

export interface CopyObjectOptions {
    sourceBucketName: string;
    sourceObjectKey: string;
    headers?: Record<string, string>;
    metadataDirective?: CopyObjectMetadataDirective;
    storageClass?: BosStorageClass;
    taggingDirective?: CopyObjectTaggingDirective;
}

export interface CopyObjectResponse {
    ETag: string;
    lastModified: string;
}

export type ObjectBody = BodyInit;
export type JsonObjectBody = Record<string, unknown>;

interface InitiateMultipartUploadResponse {
    bucket: string;
    key: string;
    uploadId: string;
}

export interface CompleteMultipartUploadResponse {
    location: string;
    bucket: string;
    key: string;
    eTag: string;
}

interface UploadPartTask {
    partNumber: number;
    start: number;
    end: number;
}

export interface UploadFileByMultipartOptions {
    partSize: number;
    concurrency: number;
    headers?: Record<string, string>;
}

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

    async copyFrom(options: CopyObjectOptions) {
        const response = await this.http.json<CopyObjectResponse>(
            'PUT',
            this.objectUrl,
            {
                headers: {
                    ...options.headers,
                    'x-bce-copy-source': `/${options.sourceBucketName}/${normalizeUrl(options.sourceObjectKey, false)}`,
                    'x-bce-metadata-directive': options.metadataDirective ?? 'copy',
                    'x-bce-storage-class': options.storageClass,
                    'x-bce-tagging-directive': options.taggingDirective,
                },
            }
        );
        return response;
    }

    async delete() {
        const response = await this.http.noContent('DELETE', this.objectUrl);
        return response;
    }

    /**
     * @see https://cloud.baidu.com/doc/BOS/s/Nkc5uy7ox
     */
    private async initiateMultipartUpload(options?: PutObjectOptions) {
        const response = await this.http.json<InitiateMultipartUploadResponse>(
            'POST',
            this.objectUrl,
            {
                params: {uploads: ''},
                headers: {
                    ...options?.headers,
                },
            }
        );
        return response;
    }

    /**
     * @see https://cloud.baidu.com/doc/BOS/s/3kc5v4qs0
     */
    private async uploadPart(uploadId: string, partNumber: number, body: ObjectBody) {
        const response = await this.http.noContent(
            'PUT',
            this.objectUrl,
            {
                params: {partNumber, uploadId},
                body,
            }
        );
        return response;
    }

    /**
     * @see https://cloud.baidu.com/doc/BOS/s/Nkc5vzayc
     */
    private async completeMultipartUpload(uploadId: string, parts: Array<{partNumber: number, eTag: string}>) {
        const response = await this.http.json<CompleteMultipartUploadResponse>(
            'POST',
            this.objectUrl,
            {
                params: {uploadId},
                body: {
                    parts: parts.map(part => ({partNumber: part.partNumber, eTag: part.eTag})),
                },
            }
        );
        return response;
    }

    /**
     * @see https://cloud.baidu.com/doc/BOS/s/Wkc5w2ndt
     */
    private async abortMultipartUpload(uploadId: string) {
        const response = await this.http.noContent(
            'DELETE',
            this.objectUrl,
            {
                params: {uploadId},
            }
        );
        return response;
    }

    private splitIntoParts(fileSize: number, partSize: number): UploadPartTask[] {
        const tasks: UploadPartTask[] = [];
        let partNumber = 1;
        for (let start = 0; start < fileSize; start += partSize) {
            const end = Math.min(start + partSize, fileSize);
            tasks.push({partNumber, start, end});
            partNumber += 1;
        }
        return tasks;
    }

    private async runWithConcurrency<T, R>(items: T[], concurrency: number, worker: (item: T) => Promise<R>) {
        const results: R[] = [];
        const queue = items.map((item, index) => ({item, index}));

        const runNext = async (): Promise<void> => {
            const task = queue.shift();
            if (!task) {
                return;
            }
            results[task.index] = await worker(task.item);
            await runNext();
        };

        const workers = Array.from({length: Math.min(concurrency, items.length)}, runNext);
        await Promise.all(workers);
        return results;
    }

    /**
     * 分片上传单个大文件，文件按`options.partSize`切分后以`options.concurrency`的并发度上传，
     * 上传过程中任意分片失败都会中止整个上传任务。
     *
     * @see https://cloud.baidu.com/doc/BOS/s/Nkc5uy7ox
     */
    async uploadFileByMultipart(file: string, options: UploadFileByMultipartOptions) {
        const fileSize = fs.statSync(file).size;
        const tasks = this.splitIntoParts(fileSize, options.partSize);
        const {body: initiateResponse} = await this.initiateMultipartUpload(
            options.headers ? {headers: options.headers} : undefined
        );
        const {uploadId} = initiateResponse;

        try {
            const uploadResults = await this.runWithConcurrency(
                tasks,
                options.concurrency,
                async task => {
                    const stream = Readable.toWeb(
                        fs.createReadStream(file, {start: task.start, end: task.end - 1})
                    ) as ReadableStream<Uint8Array>;
                    const {headers} = await this.uploadPart(uploadId, task.partNumber, stream);
                    return {partNumber: task.partNumber, eTag: headers.etag.replaceAll('"', '')};
                }
            );
            const response = await this.completeMultipartUpload(uploadId, uploadResults);
            return response;
        }
        catch (ex) {
            await this.abortMultipartUpload(uploadId);
            throw ex;
        }
    }
}
