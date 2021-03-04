declare const azure: {
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
export default azure;
