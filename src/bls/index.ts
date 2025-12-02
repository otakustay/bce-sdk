import type {RegionClientOptions} from '../shared/index.js';
import { Http} from '../shared/index.js';

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
}
