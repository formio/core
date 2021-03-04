declare const dropbox: {
    (formio: any): {
        uploadFile(file: any, fileName: any, dir: any, progressCallback: any, url: any, options: any, fileKey: any, groupPermissions: any, groupId: any, abortCallback: any): Promise<unknown>;
        downloadFile(file: any): Promise<any>;
    };
    title: string;
};
export default dropbox;
