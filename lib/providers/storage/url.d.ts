declare const url: {
    (formio: any): {
        title: string;
        name: string;
        uploadFile(file: any, fileName: any, dir: any, progressCallback: any, url: any, options: any, fileKey: any, groupPermissions: any, groupId: any, abortCallback: any): any;
        deleteFile(fileInfo: any): Promise<unknown>;
        downloadFile(file: any): Promise<any>;
    };
    title: string;
};
export default url;
