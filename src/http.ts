import {Blob} from 'node:buffer';
import {ReadableStream} from 'node:stream/web';
import {BodyInit, fetch} from 'undici';
import {fromPairs} from 'ramda';
import {Authorization, BceCredential} from './authorization';

const stringifyDate = (date: Date) => date.toISOString().replace(/\.\d+Z$/, 'Z');

const BASE_DOMAIN = 'baidubce.com';

export interface RequestOptions {
    params?: URLSearchParams | undefined;
    headers?: Record<string, string>;
    body?: BodyInit;
}

export interface ClientResponse<T> {
    headers: Record<string, string>;
    body: T;
}

export interface ClientResponseNoContent {
    headers: Record<string, string>;
}

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

    async stream(method: string, url: string, options: RequestOptions): Promise<ClientResponse<ReadableStream>> {
        const {headers, response} = await this.request(method, url, options);

        if (response.body) {
            return {headers, body: response.body};
        }

        throw new Error(`No stream body in response of ${method} ${url}`);
    }

    private async request(method: string, url: string, options: RequestOptions) {
        const {headers, params} = options;
        const timestamp = stringifyDate(new Date());
        const authorization = this.authorization.authorize(
            {
                method,
                url,
                params: params && [...params.entries()],
                headers: {
                    host: this.host,
                    'x-bce-date': timestamp,
                    ...options.headers,
                },
            },
            {timestamp}
        );
        const response = await fetch(
            this.baseUrl + url + (params ? `?${params}` : ''),
            {
                method,
                headers: {
                    ...headers,
                    authorization,
                    'x-bce-date': timestamp,
                },
                body: options.body,
            }
        );
        return {
            response,
            headers: fromPairs([...response.headers.entries()]),
        };
    }
}
