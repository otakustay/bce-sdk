import type {RegionClientOptions} from '../shared/index.js';
import {Http} from '../shared/index.js';
import {CfcFunctionClient} from './function.js';
import {CfcTriggerClient} from './trigger.js';
import {CfcConcurrencyClient} from './concurrency.js';
import {CfcConfigurationClient} from './configuration.js';
import {CfcVersionClient} from './version.js';
import type {
    CreateFunctionRequest,
    ListFunctionsQuery,
    UpdateFunctionCodeRequest,
    InvokeFunctionQuery,
} from './function.js';
import type {
    CreateTriggerRequest,
    UpdateTriggerRequest,
} from './trigger.js';
import type {UpdateFunctionConfigurationRequest} from './configuration.js';
import type {
    ListVersionsByFunctionQuery,
    PublishVersionRequest,
} from './version.js';

export type {
    FunctionEnvironment,
    FunctionCode,
    FunctionConfiguration,
    CodeStorage,
    CreateFunctionRequest,
    ListFunctionsQuery,
    ListFunctionsResponse,
    GetFunctionResponse,
    UpdateFunctionCodeRequest,
    InvokeFunctionQuery,
} from './function.js';
export type {
    Relation,
    ListTriggersResponse,
    CreateTriggerRequest,
    UpdateTriggerRequest,
} from './trigger.js';
export type {UpdateFunctionConfigurationRequest} from './configuration.js';
export type {
    ListVersionsByFunctionQuery,
    ListVersionsByFunctionResponse,
    PublishVersionRequest,
} from './version.js';

export type CfcOptions = RegionClientOptions;

export class CfcClient {
    private readonly function: CfcFunctionClient;
    private readonly trigger: CfcTriggerClient;
    private readonly concurrency: CfcConcurrencyClient;
    private readonly configuration: CfcConfigurationClient;
    private readonly version: CfcVersionClient;

    constructor(options: CfcOptions) {
        const http = Http.fromRegionSupportedServiceId('cfc', options);
        this.function = new CfcFunctionClient(http);
        this.trigger = new CfcTriggerClient(http);
        this.concurrency = new CfcConcurrencyClient(http);
        this.configuration = new CfcConfigurationClient(http);
        this.version = new CfcVersionClient(http);
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/xjwvz450q
     */
    async createFunction(request: CreateFunctionRequest) {
        return this.function.createFunction(request);
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/Zjwvz46l3
     */
    async listFunctions(query?: ListFunctionsQuery) {
        return this.function.listFunctions(query);
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/Kjwvz45ri
     */
    async getFunction(functionName: string, qualifier?: string) {
        return this.function.getFunction(functionName, qualifier);
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/fjwvz472b
     */
    async deleteFunction(functionName: string, qualifier?: string) {
        return this.function.deleteFunction(functionName, qualifier);
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/jjwvz45ex
     */
    async updateFunctionCode(functionName: string, request: UpdateFunctionCodeRequest) {
        return this.function.updateFunctionCode(functionName, request);
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/vjwvz4e9n
     */
    async invokeFunction<T = unknown>(
        functionName: string,
        payload?: Record<string, unknown>,
        query?: InvokeFunctionQuery,
    ) {
        return this.function.invokeFunction<T>(functionName, payload, query);
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/9jwvz466u
     */
    async getFunctionConfiguration(functionName: string, qualifier?: string) {
        return this.configuration.getFunctionConfiguration(functionName, qualifier);
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/2jwvz44ns
     */
    async updateFunctionConfiguration(functionName: string, request: UpdateFunctionConfigurationRequest) {
        return this.configuration.updateFunctionConfiguration(functionName, request);
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/ok5dlgr72
     */
    async setFunctionConcurrency(functionName: string, reservedConcurrentExecutions: number) {
        return this.concurrency.setFunctionConcurrency(functionName, reservedConcurrentExecutions);
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/3k5dlqspp
     */
    async deleteFunctionConcurrency(functionName: string) {
        return this.concurrency.deleteFunctionConcurrency(functionName);
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/Gjwvz4dyc
     */
    async listVersionsByFunction(functionName: string, query?: ListVersionsByFunctionQuery) {
        return this.version.listVersionsByFunction(functionName, query);
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/4jwvz4dn3
     */
    async publishVersion(functionName: string, request?: PublishVersionRequest) {
        return this.version.publishVersion(functionName, request);
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/Kjwvz499l
     */
    async listTriggers(functionBrn: string) {
        return this.trigger.listTriggers(functionBrn);
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/njwvz48yg
     */
    async createTrigger(request: CreateTriggerRequest) {
        return this.trigger.createTrigger(request);
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/zjwvz48js
     */
    async updateTrigger(request: UpdateTriggerRequest) {
        return this.trigger.updateTrigger(request);
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/hjwvz49o0
     */
    async deleteTrigger(target: string, source: string, relationId: string) {
        return this.trigger.deleteTrigger(target, source, relationId);
    }
}
