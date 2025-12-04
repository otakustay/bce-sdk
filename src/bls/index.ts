import type {RegionClientOptions} from '../shared/index.js';
import {Http} from '../shared/index.js';

// https://cloud.baidu.com/doc/BLS/s/Ck8qtng1c

const stringifyDate = (date: Date) => date.toISOString().replace(/\.\d+Z$/, 'Z');

export interface LogRecordQuery {
    logStoreName: string;
    query: string;
    startDateTime: Date;
    endDateTime: Date;
    project?: string;
    logStreamName?: string;
    limit?: number;
    sort?: 'asc' | 'desc';
    marker?: string;
    pageNo?: number;
    pageSize?: number;
}

export interface LogRecordResultItem {
    timestamp: number;
    stream: string;
    tags: Array<Record<string, unknown>>;
    offset: number;
    message: string;
}

export interface LogRecordResultSet {
    queryType: 'match' | 'sql';
    columns: string[];
    columnTypes: string[];
    rows: any[][];
    tags?: Array<Record<string, string>>;
}

export interface DatasetScanInfo {
    statistics: {
        executionTimeInMs: number;
        scanCount: number;
        scanBytes: number;
    };
}

export interface QueryLogRecordResponse {
    nextMarker?: string;
    resultSet: LogRecordResultSet;
    datasetScanInfo: DatasetScanInfo;
}

export enum DownloadTaskState {
    WAITING = 'WAITING',
    RUNNING = 'RUNNING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    EXPIRED = 'EXPIRED',
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

export type BlsOptions = RegionClientOptions;

export class BlsClient {
    private readonly http: Http;

    constructor(options: BlsOptions) {
        this.http = Http.fromRegionSupportedServiceId('bls-log', options);
    }

    /**
     * @see https://cloud.baidu.com/doc/BLS/s/hk8to0l9o
     */
    async queryLogRecord(options: LogRecordQuery) {
        const params: Record<string, any> = {
            query: options.query,
            startDateTime: stringifyDate(options.startDateTime),
            endDateTime: stringifyDate(options.endDateTime),
            project: options.project,
            logStreamName: options.logStreamName,
            limit: options.limit,
            sort: options.sort,
            marker: options.marker,
            pageNo: options.pageNo,
            pageSize: options.pageSize,
        };

        const response = await this.http.json<QueryLogRecordResponse>(
            'GET',
            `/v1/logstore/${options.logStoreName}/logrecord`,
            {params}
        );
        return response;
    }

    /**
     * @see https://cloud.baidu.com/doc/BLS/s/Hm344rht7
     */
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

    /**
     * @see https://cloud.baidu.com/doc/BLS/s/6m348wh16
     */
    async getDownloadTaskLink(uuid: string) {
        const response = await this.http.json<GetDownloadTaskLinkResponse>(
            'GET',
            `/v2/logstore/download/link/${uuid}`
        );
        return response;
    }

    /**
     * @see https://cloud.baidu.com/doc/BLS/s/um347nkxz
     */
    async describeDownloadTask(uuid: string) {
        const response = await this.http.json<DescribeDownloadTaskResponse>(
            'GET',
            `/v2/logstore/download/${uuid}`
        );
        return response;
    }
}
