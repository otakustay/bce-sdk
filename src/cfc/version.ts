import type {Http} from '../shared/index.js';
import type {FunctionConfiguration, RawFunctionConfiguration} from './function.js';
import {mapFunctionConfiguration} from './function.js';

export interface ListVersionsByFunctionQuery {
    marker?: number;
    maxItems?: number;
}

export interface ListVersionsByFunctionResponse {
    versions: FunctionConfiguration[];
}

export interface PublishVersionRequest {
    description?: string;
    codeSha256?: string;
}

export class CfcVersionClient {
    private readonly http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/Gjwvz4dyc
     */
    async listVersionsByFunction(functionName: string, query?: ListVersionsByFunctionQuery) {
        const response = await this.http.json<{Versions: RawFunctionConfiguration[]}>(
            'GET',
            `/v1/functions/${functionName}/versions`,
            {
                params: {
                    Marker: query?.marker,
                    MaxItems: query?.maxItems,
                },
            }
        );
        return {...response, body: {versions: response.body.Versions.map(mapFunctionConfiguration)}};
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/4jwvz4dn3
     */
    async publishVersion(functionName: string, request?: PublishVersionRequest) {
        const body = request ? {Description: request.description, CodeSha256: request.codeSha256} : undefined;
        const response = await this.http.json<RawFunctionConfiguration>(
            'POST',
            `/v1/functions/${functionName}/versions`,
            {body}
        );
        return {...response, body: mapFunctionConfiguration(response.body)};
    }
}
