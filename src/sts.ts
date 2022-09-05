import {BceCredential} from './authorization.js';
import {Http} from './http.js';

interface AssumeRoleOptions {
    accountId: string;
    roleName: string;
    userId?: string;
    durationSeconds?: number;
    acl?: string;
}

export interface StsOptions {
    region: string;
    credentials: BceCredential;
}

export class StsClient {
    private readonly http: Http;

    constructor({region, credentials}: StsOptions) {
        this.http = Http.fromRegionSupportedServiceId('sts', region, credentials);
    }

    async assumeRole(options: AssumeRoleOptions) {
        const params = new URLSearchParams();
        params.set('assumeRole', '');
        params.set('accountId', options.accountId);
        params.set('roleName', options.roleName);
        options.userId && params.set('userId', options.userId);
        options.durationSeconds && params.set('durationSeconds', options.durationSeconds.toString());

        const response = await this.http.json(
            'POST',
            '/v1/credential',
            {
                params,
                body: options.acl && {acl: options.acl},
            }
        );
        return response;
    }
}
