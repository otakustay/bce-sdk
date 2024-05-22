import {Http} from '../shared/http.js';

export interface CdnCredential {
    ak: string;
    sk: string;
}

export interface CdnOptions {
    credentials: CdnCredential;
    sessionToken?: string;
}

export interface PrefetchTask {
    url: string;
    startTime?: Date;
}

export interface PurgeTask {
    url: string;
    type?: 'file' | 'directory';
}

export interface DescribeDownloadTaskResponse {
    id: string;
}

export class CdnClient {
    private readonly http: Http;

    constructor(options: CdnOptions) {
        this.http = Http.fromEndpoint('cdn.baidubce.com', options);
    }

    /**
     * @see https://cloud.baidu.com/doc/CDN/s/Rjwvyf0ff
     */
    async prefetch(tasks: PrefetchTask[]) {
        const response = await this.http.json<DescribeDownloadTaskResponse>(
            'POST',
            '/v2/cache/prefetch',
            {
                body: {
                    tasks: tasks.map(v => ({url: v.url, startTime: v.startTime?.toISOString()})),
                },
            }
        );
        return response;
    }

    /**
     * @see https://cloud.baidu.com/doc/CDN/s/ijwvyeyyj
     */
    async purge(tasks: PurgeTask[]) {
        const response = await this.http.json<DescribeDownloadTaskResponse>(
            'POST',
            '/v2/cache/purge',
            {
                body: {
                    tasks: tasks.map(v => ({url: v.url, type: v.type})),
                },
            }
        );
        return response;
    }
}
