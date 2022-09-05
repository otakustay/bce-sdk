import {Blob} from 'node:buffer';
import {fromPairs} from 'ramda';
import {Authorization, BceCredential} from './authorization.js';
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
    private readonly baseUrl: string;
    private readonly authorization: Authorization;
    private readonly host: string;

    private constructor(endpoint: string, credentials: BceCredential) {
        const url = new URL(`https://${endpoint}`);
        this.host = url.host;
        this.baseUrl = url.origin;
        this.authorization = new Authorization(credentials);
    }

    static fromEndpoint(endpoint: string, credentials: BceCredential) {
        return new Http(endpoint, credentials);
    }

    static fromRegionSupportedServiceId(serviceId: string, region: string, credentials: BceCredential) {
        return new Http(`${serviceId}.${region}.${BASE_DOMAIN}`, credentials);
    }

    static fromServiceId(serviceId: string, credentials: BceCredential) {
        return new Http(`${serviceId}.${BASE_DOMAIN}`, credentials);
    }

    async json<T>(method: string, url: string, options: RequestOptions): Promise<ClientResponse<T>> {
        const {headers, response} = await this.request(method, url, options);
        return {headers, body: await response.json() as T};
    }

    async text(method: string, url: string, options: RequestOptions): Promise<ClientResponse<string>> {
        const {headers, response} = await this.request(method, url, options);
        return {headers, body: await response.text()};
    }

    async noContent(method: string, url: string, options: RequestOptions): Promise<ClientResponseNoContent> {
        const {headers} = await this.request(method, url, options);
        return {headers};
    }

    async blob(method: string, url: string, options: RequestOptions): Promise<ClientResponse<Blob>> {
        const {headers, response} = await this.request(method, url, options);
        return {headers, body: await response.blob()};
    }

    async stream(method: string, url: string, options: RequestOptions): Promise<ClientResponse<ResponseStream>> {
        const {headers, response} = await this.request(method, url, options);

        if (response.body) {
            return {headers, body: response.body};
        }

        throw new Error(`No stream body in response of ${method} ${url}`);
    }

    private async request(method: string, url: string, options: RequestOptions) {
        const {headers, params} = options;
        const timestamp = stringifyDate(new Date());
        const searchParams = constructSearchParams(params);
        const authorization = this.authorization.authorize(
            {
                method,
                url,
                params: searchParams && [...searchParams.entries()],
                headers: {
                    host: this.host,
                    'x-bce-date': timestamp,
                    ...options.headers,
                },
            },
            {timestamp}
        );
        const request: RequestInit = {
            method,
            headers: {
                ...headers,
                authorization,
                'x-bce-date': timestamp,
            },
        };

        if (isPlainObject(options.body)) {
            request.body = JSON.stringify(options.body);
            Object.assign(
                request.headers!,
                {'content-type': 'application/json'}
            );
        }
        else if (options.body) {
            request.body = options.body;
        }

        const response = await fetch(
            this.baseUrl + url + (searchParams ? `?${searchParams}` : ''),
            request
        );

        const responseHeaders = fromPairs([...response.headers.entries()]);

        if (response.ok) {
            return {headers: responseHeaders, response};
        }

        const body = await response.text();
        throw new RequestError(response.status, responseHeaders, body);
    }
}
