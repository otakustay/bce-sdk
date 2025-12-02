import type {BceCredentialContext, RegionClientOptions} from './interface.js';
import {Authorization} from './authorization.js';
import {RequestError} from './error.js';

const stringifyDate = (date: Date) => date.toISOString().replace(/\.\d+Z$/, 'Z');

// https://github.com/sindresorhus/is-plain-obj/blob/68e8cc77bb1bbd0bf7d629d3574b6ca70289b2cc/index.js
const isPlainObject = (value: any): value is Record<string, any> => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return (
        (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null)
        && !(Symbol.toStringTag in value)
        && !(Symbol.iterator in value)
    );
};

const BASE_DOMAIN = 'baidubce.com';

interface HttpContext {
    headers?: Record<string, string>;
}

type SearchParamsDict = Record<string, string | number | undefined | null | undefined>;

export interface RequestOptions {
    params?: URLSearchParams | SearchParamsDict | undefined;
    headers?: Record<string, string>;
    body?: BodyInit | Record<string, any> | undefined;
}

export interface ClientResponse<T> {
    headers: Record<string, string>;
    body: T;
}

type ResponseStream = ReadableStream<Uint8Array>;

export interface ClientResponseNoContent {
    headers: Record<string, string>;
}

const entriesToRecord = <T>(entries: Array<[string, T]>) => {
    const record: Record<string, T> = {};
    for (const [key, value] of entries) {
        record[key] = value;
    }
    return record;
};

const constructSearchParams = (dict: URLSearchParams | SearchParamsDict | undefined) => {
    if (!dict) {
        return null;
    }

    if (dict instanceof URLSearchParams) {
        return dict;
    }

    const entries = Object.entries(dict).reduce(
        (entries, [key, value]) => {
            if (value != null) {
                entries.push([key, value.toString()]);
            }
            return entries;
        },
        [] as Array<[string, string]>
    );
    return entries.length ? new URLSearchParams(entries) : null;
};

export class Http {
    private readonly endpoint: string;
    private readonly context: BceCredentialContext;
    private readonly baseUrl: string;
    private readonly authorization: Authorization;
    private readonly headers: Record<string, string>;

    private constructor(endpoint: string, context: BceCredentialContext, httpContext?: HttpContext) {
        const url = new URL(`https://${endpoint}`);
        this.endpoint = endpoint;
        this.context = context;
        this.baseUrl = url.origin;
        this.headers = {host: url.host, ...httpContext?.headers};
        this.authorization = new Authorization(context.credentials);
    }

    static fromEndpoint(endpoint: string, context: BceCredentialContext) {
        return new Http(endpoint, context);
    }

    static fromRegionSupportedServiceId(serviceId: string, context: RegionClientOptions) {
        return new Http(`${serviceId}.${context.region}.${BASE_DOMAIN}`, context);
    }

    static fromServiceId(serviceId: string, context: RegionClientOptions) {
        return new Http(`${serviceId}.${BASE_DOMAIN}`, context);
    }

    withHeaders(headers: Record<string, string>) {
        return new Http(this.endpoint, this.context, {headers});
    }

    async json<T>(method: string, url: string, options?: RequestOptions): Promise<ClientResponse<T>> {
        const {headers, response} = await this.request(method, url, options);
        return {headers, body: await response.json() as T};
    }

    async text(method: string, url: string, options?: RequestOptions): Promise<ClientResponse<string>> {
        const {headers, response} = await this.request(method, url, options);
        return {headers, body: await response.text()};
    }

    async noContent(method: string, url: string, options?: RequestOptions): Promise<ClientResponseNoContent> {
        const {headers} = await this.request(method, url, options);
        return {headers};
    }

    async blob(method: string, url: string, options?: RequestOptions): Promise<ClientResponse<Blob>> {
        const {headers, response} = await this.request(method, url, options);
        return {headers, body: await response.blob()};
    }

    async stream(method: string, url: string, options?: RequestOptions): Promise<ClientResponse<ResponseStream>> {
        const {headers, response} = await this.request(method, url, options);

        if (response.body) {
            return {headers, body: response.body};
        }

        throw new Error(`No stream body in response of ${method} ${url}`);
    }

    private async request(method: string, url: string, options?: RequestOptions) {
        const searchParams = constructSearchParams(options?.params);
        const timestamp = stringifyDate(new Date());
        const headers = this.constructHeaders(options);
        headers['x-bce-date'] = timestamp;
        headers.authorization = await this.authorization.authorize(
            {
                method,
                url,
                headers,
                params: searchParams && [...searchParams.entries()],
            },
            {timestamp}
        );

        const requestInit = {
            method,
            headers,
            body: isPlainObject(options?.body) ? JSON.stringify(options?.body) : (options?.body ?? null),
            duplex: 'half',
        };

        const response = await fetch(
            this.baseUrl + url + (searchParams ? `?${searchParams}` : ''),
            requestInit
        );

        const responseHeaders = entriesToRecord([...response.headers.entries()]);

        if (response.ok) {
            return {headers: responseHeaders, response};
        }

        const body = await response.text();
        throw new RequestError(response.status, responseHeaders, body);
    }

    private constructHeaders(options: RequestOptions | undefined) {
        const headers: Record<string, string> = {
            // 允许覆盖`host`头，但`x-bce-date`永远是内部生成的，不然签名过不去
            ...this.headers,
            ...options?.headers,
        };
        if (this.context.sessionToken) {
            headers['x-bce-security-token'] = this.context.sessionToken;
        }
        if (isPlainObject(options?.body)) {
            headers['content-type'] ??= 'application/json';
        }
        return headers;
    }
}
