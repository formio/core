declare const _default: {
    base64: {
        (): {
            title: string;
            name: string;
            uploadFile(file: any, fileName: any): Promise<unknown>;
            downloadFile(file: any): Promise<any>;
        };
        title: string;
    };
    dropbox: {
        (formio: any): {
            uploadFile(file: any, fileName: any, dir: any, progressCallback: any, url: any, options: any, fileKey: any, groupPermissions: any, groupId: any, abortCallback: any): Promise<unknown>;
            downloadFile(file: any): Promise<any>;
        };
        title: string;
    };
    s3: {
        (formio: any): {
            uploadFile(file: any, fileName: any, dir: any, progressCallback: any, url: any, options: any, fileKey: any, groupPermissions: any, groupId: any, abortCallback: any): Promise<{
                storage: string;
                name: any;
                bucket: any;
                key: any;
                url: any;
                acl: any;
                size: any;
                type: any;
            }>;
            downloadFile(file: any): any;
        };
        title: string;
    };
    url: {
        (formio: any): {
            title: string;
            name: string;
            uploadFile(file: any, fileName: any, dir: any, progressCallback: any, url: any, options: any, fileKey: any, groupPermissions: any, groupId: any, abortCallback: any): any;
            deleteFile(fileInfo: any): Promise<unknown>;
            downloadFile(file: any): Promise<any>;
        };
        title: string;
    };
    azure: {
        (formio: any): {
            uploadFile(file: any, fileName: any, dir: any, progressCallback: any, url: any, options: any, fileKey: any, groupPermissions: any, groupId: any, abortCallback: any): Promise<{
                storage: string;
                name: any;
                size: any;
                type: any;
                groupPermissions: any;
                groupId: any;
            }>;
            downloadFile(file: any): any;
        };
        title: string;
    };
    indexeddb: {
        (): {
            title: string;
            name: string;
            uploadFile(file: any, fileName: any, dir: any, progressCallback: any, url: any, options: any): Promise<unknown> | undefined;
            downloadFile(file: any, options: any): Promise<unknown>;
            deleteFile(file: any, options?: any): Promise<unknown>;
        };
        title: string;
    };
};
export default _default;
