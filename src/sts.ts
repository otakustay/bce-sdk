import {RegionClientOptions} from './interface.js';
import {Http} from './http.js';

// https://cloud.baidu.com/doc/IAM/s/Qjwvyc8ov

interface AssumeRoleOptions {
    accountId: string;
    roleName: string;
    userId?: string;
    durationSeconds?: number;
    acl?: string;
}

// https://cloud.baidu.com/doc/BOS/s/Tjwvysda9

interface AccessControlDescription {
    id?: string;
    eid?: string;
    service: string;
    resource: string[];
    region: string;
    effect: 'Allow' | 'Deny';
    permission: string[];
}

interface SessionTokenOptions {
    durationSeconds?: number;
    accessControlList: AccessControlDescription[];
    attachment?: string;
}

interface SessionTokenResponse {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
    createTime: string;
    expiration: string;
    userId: string;
}

export type StsOptions = RegionClientOptions;

export class StsClient {
    private readonly http: Http;

    constructor(options: StsOptions) {
        this.http = Http.fromRegionSupportedServiceId('sts', options);
    }

    async getSessionToken(options: SessionTokenOptions) {
        const response = await this.http.json<SessionTokenResponse>(
            'POST',
            '/v1/sessionToken',
            {
                params: {durationSeconds: options.durationSeconds},
                body: {
                    accessControlList: options.accessControlList,
                    attachment: options.attachment,
                },
            }
        );
        return response;
    }

    async assumeRole(options: AssumeRoleOptions) {
        const params = new URLSearchParams();
        params.set('assumeRole', '');
        params.set('accountId', options.accountId);
        params.set('roleName', options.roleName);
        options.userId && params.set('userId', options.userId);
        options.durationSeconds && params.set('durationSeconds', options.durationSeconds.toString());

        const response = await this.http.json<SessionTokenResponse>(
            'POST',
            '/v1/credential',
            {
                params: {
                    assumeRole: '',
                    accountId: options.accountId,
                    roleName: options.roleName,
                    userId: options.userId,
                    durationSeconds: options.durationSeconds,
                },
                body: options.acl && {acl: options.acl},
            }
        );
        return response;
    }
}
