export type {
    RegionClientOptions,
    BceCredential,
    BceCredentialContext,
    ClientResponse,
    ClientResponseNoContent,
    RequestOptions,
} from './shared/index.js';
export {RequestError, isRequestError} from './shared/index.js';
export type {
    LogRecordQuery,
    LogRecordQueryV2,
    LogRecordResultSet,
    LogRecordResultSetV2,
    QueryLogRecordResponse,
    QueryLogRecordResponseV2,
    LogRecordResultItem,
    BlsOptions,
    DownloadTaskState,
    CreateDownloadTaskRequest,
    CreateDownloadTaskResult,
    CreateDownloadTaskResponse,
    GetDownloadTaskLinkResult,
    GetDownloadTaskLinkResponse,
    DownloadTask,
    DescribeDownloadTaskResult,
    DescribeDownloadTaskResponse,
} from './bls/index.js';
export {BlsClient} from './bls/index.js';
export type {
    ObjectBody,
    PutObjectOptions,
    BosObjectClient,
    CommonPrefix,
    ListObjectOptions,
    ListObjectResponse,
    ObjectContent,
    ObjectOwner,
    BosBucketClient,
    BosOptions,
} from './bos/index.js';
export {BosClient} from './bos/index.js';
export type {
    AssumeRoleOptions,
    AccessControlDescription,
    SessionTokenOptions,
    SessionTokenResponse,
    StsOptions,
} from './sts/index.js';
export {StsClient} from './sts/index.js';
