export type ProjectFileStorageConfig = {
    azure?: AzureBlobConfig;
    s3?: S3MinioConfig;
    dropbox?: DropboxConfig;
    google?: any;
};
export type S3MinioConfig = {
    AWSAccessKeyId: string;
    AWSSecretKey: string;
    bucket: string;
    bucketUrl: string;
    acl?: 'public-read' | 'private';
    encryption?: string;
    expiration?: number;
    region?: string;
    maxSize?: number;
    startsWith?: string;
    minio?: boolean;
};
export type AzureBlobConfig = {
    connectionString: string;
    container: string;
    expiration?: number;
    startsWith?: string;
};
export type DropboxConfig = {
    access_token: string;
    account_id: string;
    token_type: string;
    uid: string;
};
