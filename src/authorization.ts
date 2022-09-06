import {BceCredential} from './interface.js';

// https://cloud.baidu.com/doc/Reference/s/njwvz1yfu

export interface RequestInfo {
    params: Array<[string, string]> | null;
    headers: Record<string, string>;
    method: string;
    url: string;
}

const NORMALIZE_MAP: Record<string, string> = {
    '!': '%21',
    '\'': '%27',
    '(': '%28',
    ')': '%29',
    '*': '%2A',
};

const normalize = (value: string) =>
    encodeURIComponent(value).replace(/[!'()*]/g, v => NORMALIZE_MAP[v]);

const canonicalizeSearchParams = (params: Array<[string, string]> | null) => {
    if (!params) {
        return '';
    }

    const canonicalize = ([key, value]: [string, string]) => {
        if (key.toLowerCase() === 'authorization') {
            return [];
        }
        return `${key}=${normalize(value)}`;
    };
    return params.flatMap(canonicalize).sort().join('&');
};

const DEFAULT_HEADERS_TO_SIGN = ['host', 'content-md5', 'content-length', 'content-type'];

interface CanonicalizeHeadersContext {
    signedHeaderNames: string[];
    canonicalizedHeaders: string[];
}

interface CanonicalizeHeadersResult {
    signedHeaderNames: string[];
    canonicalizedHeaders: string;
}

const canonicalizeHeaders = (headers: Record<string, string>, headerNamesToSign = DEFAULT_HEADERS_TO_SIGN) => {
    const {signedHeaderNames, canonicalizedHeaders} = Object.entries(headers).reduce(
        (result, [name, value]) => {
            const headerName = name.toLowerCase();
            const headerValue = typeof value === 'string' ? value.trim() : value;

            if (headerValue && (headerNamesToSign.includes(headerName) || headerName.startsWith('x-bce-'))) {
                result.signedHeaderNames.push(headerName);
                result.canonicalizedHeaders.push(`${normalize(headerName)}:${normalize(headerValue)}`);
            }

            return result;
        },
        {signedHeaderNames: [], canonicalizedHeaders: []} as CanonicalizeHeadersContext
    );
    const result: CanonicalizeHeadersResult = {
        signedHeaderNames,
        canonicalizedHeaders: canonicalizedHeaders.sort().join('\n'),
    };
    return result;
};

const hash = async (key: string, value: string) => {
    const encoder = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        encoder.encode(key),
        {name: 'HMAC', hash: 'SHA-256'},
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(value));
    // const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(value));
    const array = [...new Uint8Array(signature)];
    return array.map(v => v.toString(16).padStart(2, '0')).join('');
};

interface Options {
    timestamp: string;
    headerNamesToSign?: string[];
    expireInSeconds?: number;
}

interface SignatureContext {
    canonicalRequest: string;
    signedHeaderNames: string[];
    authStringPrefix: string;
    signingKey: string;
    signature: string;
}

export class Authorization {
    constructor(private readonly credentials: BceCredential) {}

    // NOTE: 百度云V1签名算法，你改一个字都会跑不过去你信不信
    async authorize(request: RequestInfo, options: Options): Promise<string> {
        const context = await this.createContext(request, options);
        return `${context.authStringPrefix}/${context.signedHeaderNames.join(';')}/${context.signature}`;
    }

    private async createContext(request: RequestInfo, options: Options): Promise<SignatureContext> {
        const {signedHeaderNames, canonicalizedHeaders} = canonicalizeHeaders(
            request.headers,
            options.headerNamesToSign
        );
        const canonicalRequestParts = [
            request.method,
            request.url,
            canonicalizeSearchParams(request.params),
            canonicalizedHeaders,
        ];
        const canonicalRequest = canonicalRequestParts.join('\n');
        const authStringPrefix = `bce-auth-v1/${this.credentials.ak}/${options.timestamp}/${
            options.expireInSeconds || 1800
        }`;
        const signingKey = await hash(this.credentials.sk, authStringPrefix);
        const signature = await hash(signingKey, canonicalRequest);
        return {
            canonicalRequest,
            signedHeaderNames,
            authStringPrefix,
            signingKey,
            signature,
        };
    }
}
