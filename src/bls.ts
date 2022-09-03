import {BceCredential} from './authorization';
import {Http} from './http';

const stringifyDate = (date: Date) => date.toISOString().replace(/\.\d+Z$/, 'Z');

export interface LogRecordQuery {
    logStoreName: string;
    query: string;
    startDateTime: Date;
    endDateTime: Date;
}

export interface LogRecordResultSet {
    columns: string[];
    rows: any[][];
    isTruncated: boolean;
    truncatedReason: string;
}

export interface QueryLogRecordResponse {
    resultSet?: LogRecordResultSet;
}

export interface BlsOptions {
    region: string;
    credentials: BceCredential;
}

export class BlsClient {
    private readonly http: Http;

    constructor({region, credentials}: BlsOptions) {
        this.http = Http.fromRegionSupportedServiceId('bls-log', region, credentials);
    }

    async queryLogRecord({logStoreName, query, startDateTime, endDateTime}: LogRecordQuery) {
        const params = new URLSearchParams();
        params.set('query', query);
        params.set('startDateTime', stringifyDate(startDateTime));
        params.set('endDateTime', stringifyDate(endDateTime));

        const response = await this.http.json<QueryLogRecordResponse>(
            'GET',
            `/v1/logstore/${logStoreName}/logrecord`,
            {
                params,
                headers: {
                    'content-type': 'application/json',
                },
            }
        );
        return response;
    }
}
