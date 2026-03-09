import type {Http} from '../shared/index.js';

export interface Relation {
    relationId: string;
    sid: string;
    source: string;
    target: string;
    data: Record<string, unknown>;
}

export interface ListTriggersResponse {
    relation: Relation[];
}

export interface CreateTriggerRequest {
    target: string;
    source: string;
    data?: Record<string, unknown>;
}

export interface UpdateTriggerRequest {
    relationId: string;
    target: string;
    source: string;
    data?: Record<string, unknown>;
}

interface RawRelation {
    RelationId: string;
    Sid: string;
    Source: string;
    Target: string;
    Data: Record<string, unknown>;
}

function mapRelation(raw: RawRelation): Relation {
    return {
        relationId: raw.RelationId,
        sid: raw.Sid,
        source: raw.Source,
        target: raw.Target,
        data: raw.Data,
    };
}

export class CfcTriggerClient {
    private readonly http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/Kjwvz499l
     */
    async listTriggers(functionBrn: string) {
        const response = await this.http.json<{Relation: RawRelation[]}>(
            'GET',
            '/v1/relation',
            {params: {FunctionBrn: functionBrn}}
        );
        return {...response, body: {relation: response.body.Relation.map(mapRelation)}};
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/njwvz48yg
     */
    async createTrigger(request: CreateTriggerRequest) {
        const body = {
            Target: request.target,
            Source: request.source,
            Data: request.data,
        };
        const response = await this.http.json<{Relation: RawRelation}>(
            'POST',
            '/v1/relation',
            {body}
        );
        return {...response, body: {relation: mapRelation(response.body.Relation)}};
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/zjwvz48js
     */
    async updateTrigger(request: UpdateTriggerRequest) {
        const body = {
            RelationId: request.relationId,
            Target: request.target,
            Source: request.source,
            Data: request.data,
        };
        const response = await this.http.json<{Relation: RawRelation}>(
            'PUT',
            '/v1/relation',
            {body}
        );
        return {...response, body: {relation: mapRelation(response.body.Relation)}};
    }

    /**
     * @see https://cloud.baidu.com/doc/CFC/s/hjwvz49o0
     */
    async deleteTrigger(target: string, source: string, relationId: string) {
        const response = await this.http.noContent(
            'DELETE',
            '/v1/relation',
            {params: {Target: target, Source: source, RelationId: relationId}}
        );
        return response;
    }
}
