declare const indexeddb: {
    (): {
        title: string;
        name: string;
        uploadFile(file: any, fileName: any, dir: any, progressCallback: any, url: any, options: any): Promise<unknown> | undefined;
        downloadFile(file: any, options: any): Promise<unknown>;
        deleteFile(file: any, options?: any): Promise<unknown>;
    };
    title: string;
};
export default indexeddb;
