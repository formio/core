declare const s3: {
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
export default s3;
