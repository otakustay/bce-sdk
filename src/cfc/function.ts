import type {Http} from '../shared/index.js';

export interface FunctionEnvironment {
    variables?: Record<string, string>;
}

export interface FunctionCode {
    zipFile?: Uint8Array;
    bosBucket?: string;
    bosObject?: string;
    publish?: boolean;
    dryRun?: boolean;
}

export interface FunctionConfiguration {
    uid: string;
    description: string;
    functionBrn: string;
    functionArn: string;
    region: string;
    timeout: number;
    versionDesc: string;
    updatedAt: string;
    lastModified: string;
    codeSha256: string;
    codeSize: number;
    functionName: string;
    handler: string;
    version: string;
    runtime: string;
    memorySize: number;
    environment: FunctionEnvironment;
    commitId?: string;
    role?: string;
    logType?: string;
    logBosDir?: string;
}

export interface CodeStorage {
    location: string;
    repositoryType: string;
}

export interface CreateFunctionRequest {
    functionName: string;
    handler: string;
    runtime: string;
    code: FunctionCode;
    description?: string;
    timeout?: number;
    memorySize?: number;
    environment?: FunctionEnvironment;
}

export interface ListFunctionsQuery {
    functionVersion?: string;
    marker?: number;
    maxItems?: number;
}

export interface ListFunctionsResponse {
    functions: FunctionConfiguration[];
}

export interface GetFunctionResponse {
    code: CodeStorage;
    configuration: FunctionConfiguration;
}

export interface UpdateFunctionCodeRequest {
    zipFile?: Uint8Array;
    bosBucket?: string;
    bosObject?: string;
    publish?: boolean;
    dryRun?: boolean;
}

export interface InvokeFunctionQuery {
    invocationType?: 'Event' | 'RequestResponse' | 'DryRun';
    logType?: 'Tail' | 'None';
    qualifier?: string;
}

// Internal types for raw HTTP API responses (PascalCase as returned by BCE API)

export interface RawFunctionConfiguration {
    Uid: string;
    Description: string;
    FunctionBrn: string;
    FunctionArn: string;
    Region: string;
    Timeout: number;
    VersionDesc: string;
    UpdatedAt: string;
    LastModified: string;
    CodeSha256: string;
    CodeSize: number;
    FunctionName: string;
    Handler: string;
    Version: string;
    Runtime: string;
    MemorySize: number;
    Environment: {Variables?: Record<string, string>};
    CommitId?: string;
    Role?: string;
    LogType?: string;
    LogBosDir?: string;
}

export function mapFunctionConfiguration(raw: RawFunctionConfiguration): FunctionConfiguration {
    const environment: FunctionEnvironment = {};
    if (raw.Environment?.Variables !== undefined) {
        environment.variables = raw.Environment.Variables;
    }
    const result: FunctionConfiguration = {
        uid: raw.Uid,
        description: raw.Description,
        functionBrn: raw.FunctionBrn,
        functionArn: raw.FunctionArn,
        region: raw.Region,
        timeout: raw.Timeout,
        versionDesc: raw.VersionDesc,
        updatedAt: raw.UpdatedAt,
        lastModified: raw.LastModified,
        codeSha256: raw.CodeSha256,
        codeSize: raw.CodeSize,
        functionName: raw.FunctionName,
        handler: raw.Handler,
        version: raw.Version,
        runtime: raw.Runtime,
        memorySize: raw.MemorySize,
        environment,
    };
    if (raw.CommitId !== undefined) {
        result.commitId = raw.CommitId;
    }
    if (raw.Role !== undefined) {
        result.role = raw.Role;
    }
    if (raw.LogType !== undefined) {
        result.logType = raw.LogType;
    }
    if (raw.LogBosDir !== undefined) {
        result.logBosDir = raw.LogBosDir;
    }
    return result;
}

export class CfcFunctionClient {
    private readonly http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/xjwvz450q
     */
    async createFunction(request: CreateFunctionRequest) {
        const body = {
            FunctionName: request.functionName,
            Handler: request.handler,
            Runtime: request.runtime,
            Code: {
                BosBucket: request.code.bosBucket,
                BosObject: request.code.bosObject,
                Publish: request.code.publish,
                DryRun: request.code.dryRun,
                ZipFile: request.code.zipFile
                    ? Buffer.from(request.code.zipFile).toString('base64')
                    : undefined,
            },
            Description: request.description,
            Timeout: request.timeout,
            MemorySize: request.memorySize,
            Environment: request.environment ? {Variables: request.environment.variables} : undefined,
        };
        const response = await this.http.json<RawFunctionConfiguration>(
            'POST',
            '/v1/functions',
            {body}
        );
        return {...response, body: mapFunctionConfiguration(response.body)};
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/Zjwvz46l3
     */
    async listFunctions(query?: ListFunctionsQuery) {
        const response = await this.http.json<{Functions: RawFunctionConfiguration[]}>(
            'GET',
            '/v1/functions',
            {
                params: {
                    FunctionVersion: query?.functionVersion,
                    Marker: query?.marker,
                    MaxItems: query?.maxItems,
                },
            }
        );
        return {...response, body: {functions: response.body.Functions.map(mapFunctionConfiguration)}};
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/Kjwvz45ri
     */
    async getFunction(functionName: string, qualifier?: string) {
        const response = await this.http.json<{
            Code: {Location: string, RepositoryType: string};
            Configuration: RawFunctionConfiguration;
        }>(
            'GET',
            `/v1/functions/${functionName}`,
            {params: {Qualifier: qualifier}}
        );
        return {
            ...response,
            body: {
                code: {
                    location: response.body.Code.Location,
                    repositoryType: response.body.Code.RepositoryType,
                },
                configuration: mapFunctionConfiguration(response.body.Configuration),
            },
        };
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/fjwvz472b
     */
    async deleteFunction(functionName: string, qualifier?: string) {
        const response = await this.http.noContent(
            'DELETE',
            `/v1/functions/${functionName}`,
            {params: {Qualifier: qualifier}}
        );
        return response;
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/jjwvz45ex
     */
    async updateFunctionCode(functionName: string, request: UpdateFunctionCodeRequest) {
        const body = {
            BosBucket: request.bosBucket,
            BosObject: request.bosObject,
            Publish: request.publish,
            DryRun: request.dryRun,
            ZipFile: request.zipFile
                ? Buffer.from(request.zipFile).toString('base64')
                : undefined,
        };
        const response = await this.http.json<RawFunctionConfiguration>(
            'PUT',
            `/v1/functions/${functionName}/code`,
            {body}
        );
        return {...response, body: mapFunctionConfiguration(response.body)};
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/vjwvz4e9n
     */
    async invokeFunction<T = unknown>(
        functionName: string,
        payload?: Record<string, unknown>,
        query?: InvokeFunctionQuery,
    ) {
        const response = await this.http.json<T>(
            'POST',
            `/v1/functions/${functionName}/invocations`,
            {
                params: {
                    InvocationType: query?.invocationType,
                    LogType: query?.logType,
                    Qualifier: query?.qualifier,
                },
                body: payload,
            }
        );
        return response;
    }
}
