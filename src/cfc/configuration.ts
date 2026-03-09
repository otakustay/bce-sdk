import type {Http} from '../shared/index.js';
import type {FunctionEnvironment, RawFunctionConfiguration} from './function.js';
import {mapFunctionConfiguration} from './function.js';

export interface UpdateFunctionConfigurationRequest {
    description?: string;
    timeout?: number;
    handler?: string;
    runtime?: string;
    memorySize?: number;
    environment?: FunctionEnvironment;
    logType?: string;
    logBosDir?: string;
}

export class CfcConfigurationClient {
    private readonly http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/9jwvz466u
     */
    async getFunctionConfiguration(functionName: string, qualifier?: string) {
        const response = await this.http.json<RawFunctionConfiguration>(
            'GET',
            `/v1/functions/${functionName}/configuration`,
            {params: {Qualifier: qualifier}}
        );
        return {...response, body: mapFunctionConfiguration(response.body)};
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/2jwvz44ns
     */
    async updateFunctionConfiguration(functionName: string, request: UpdateFunctionConfigurationRequest) {
        const body = {
            Description: request.description,
            Timeout: request.timeout,
            Handler: request.handler,
            Runtime: request.runtime,
            MemorySize: request.memorySize,
            Environment: request.environment ? {Variables: request.environment.variables} : undefined,
            LogType: request.logType,
            LogBosDir: request.logBosDir,
        };
        const response = await this.http.json<RawFunctionConfiguration>(
            'PUT',
            `/v1/functions/${functionName}/configuration`,
            {body}
        );
        return {...response, body: mapFunctionConfiguration(response.body)};
    }
}
