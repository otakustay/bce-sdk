import type {RegionClientOptions} from '../shared/index.js';
import {Http} from '../shared/index.js';

// https://cloud.baidu.com/doc/BLS/s/Ck8qtng1c

const stringifyDate = (date: Date) => date.toISOString().replace(/\.\d+Z$/, 'Z');

export interface LogRecordQuery {
    logStoreName: string;
    query: string;
    startDateTime: Date;
    endDateTime: Date;
}

export interface LogRecordQueryV2 extends LogRecordQuery {
    limit?: number;
    sort?: 'asc' | 'desc';
}

export enum DownloadTaskState {
    WAITING = 'WAITING',
    RUNNING = 'RUNNING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    EXPIRED = 'EXPIRED'
}

export interface CreateDownloadTaskRequest {
    name?: string;
    project?: string;
    logStoreName: string;
    logStreamName?: string;
    query?: string;
    queryStartTime: string;
    queryEndTime: string;
    format?: 'json' | 'csv';
    limit?: number;
    order?: 'desc' | 'asc';
    fileDir?: string;
}

export interface CreateDownloadTaskResult {
    uuid: string;
}

export interface CreateDownloadTaskResponse {
    success: boolean;
    code: string;
    message: string;
    result: CreateDownloadTaskResult;
}

export interface GetDownloadTaskLinkResult {
    fileDir: string;
    fileName: string;
    link: string;
}

export interface GetDownloadTaskLinkResponse {
    success: boolean;
    code: string;
    message: string;
    result: GetDownloadTaskLinkResult;
}

export interface DownloadTask {
    uuid: string;
    name: string;
    project: string;
    logStoreName: string;
    logStreamName: string;
    query: string;
    queryStartTime: string;
    queryEndTime: string;
    format: string;
    limit: number;
    order: string;
    state: DownloadTaskState;
    failedCode: string;
    failedMessage: string;
    writtenRows: number;
    fileDir: string;
    fileName: string;
    execStartTime: string;
    execEndTime: string;
    createdTime: string;
    updatedTime: string;
}

export interface DescribeDownloadTaskResult {
    task: DownloadTask;
}

export interface DescribeDownloadTaskResponse {
    success: boolean;
    code: string;
    message: string;
    result: DescribeDownloadTaskResult;
}

interface LogRecordResultSetBase {
    columns: string[];
    isTruncated: boolean;
    truncatedReason: string;
}

export interface LogRecordResultSet extends LogRecordResultSetBase {
    columns: string[];
    isTruncated: boolean;
    truncatedReason: string;
}

export interface QueryLogRecordResponse {
    resultSet?: LogRecordResultSet;
}

export interface LogRecordResultItem {
    timestamp: number;
    stream: string;
    tags: Array<Record<string, unknown>>;
    offset: number;
    message: string;
}

export interface LogRecordResultSetV2 extends LogRecordResultSetBase {
    logRecords: LogRecordResultItem[];
}

export interface QueryLogRecordResponseV2 {
    resultSet?: LogRecordResultSetV2;
}

export type BlsOptions = RegionClientOptions;

export class BlsClient {
    private readonly http: Http;

    constructor(options: BlsOptions) {
        this.http = Http.fromRegionSupportedServiceId('bls-log', options);
    }

    async queryLogRecord({logStoreName, query, startDateTime, endDateTime}: LogRecordQuery) {
        const response = await this.http.json<QueryLogRecordResponse>(
            'GET',
            `/v1/logstore/${logStoreName}/logrecord`,
            {
                params: {
                    query,
                    startDateTime: stringifyDate(startDateTime),
                    endDateTime: stringifyDate(endDateTime),
                },
            }
        );
        return response;
    }

    async queryLogRecordV2({logStoreName, query, startDateTime, endDateTime, limit, sort}: LogRecordQueryV2) {
        const response = await this.http.json<QueryLogRecordResponseV2>(
            'GET',
            `/v2/logstore/${logStoreName}/logrecord`,
            {
                params: {
                    query,
                    limit,
                    sort,
                    startDateTime: stringifyDate(startDateTime),
                    endDateTime: stringifyDate(endDateTime),
                },
            }
        );
        return response;
    }

    async createDownloadTask(request: CreateDownloadTaskRequest) {
        const response = await this.http.json<CreateDownloadTaskResponse>(
            'POST',
            '/v2/logstore/download',
            {
                body: request,
            }
        );
        return response;
    }

    async getDownloadTaskLink(uuid: string) {
        const response = await this.http.json<GetDownloadTaskLinkResponse>(
            'GET',
            `/v2/logstore/download/link/${uuid}`
        );
        return response;
    }

    async describeDownloadTask(uuid: string) {
        const response = await this.http.json<DescribeDownloadTaskResponse>(
            'GET',
            `/v2/logstore/download/${uuid}`
        );
        return response;
    }
}
