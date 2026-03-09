import type {Http} from '../shared/index.js';

export class CfcConcurrencyClient {
    private readonly http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/ok5dlgr72
     */
    async setFunctionConcurrency(functionName: string, reservedConcurrentExecutions: number) {
        const response = await this.http.noContent(
            'PUT',
            `/v1/functions/${functionName}/concurrency`,
            {body: {ReservedConcurrentExecutions: reservedConcurrentExecutions}}
        );
        return response;
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/3k5dlqspp
     */
    async deleteFunctionConcurrency(functionName: string) {
        const response = await this.http.noContent(
            'DELETE',
            `/v1/functions/${functionName}/concurrency`
        );
        return response;
    }
}
