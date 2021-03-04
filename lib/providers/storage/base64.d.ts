declare const base64: {
    (): {
        title: string;
        name: string;
        uploadFile(file: any, fileName: any): Promise<unknown>;
        downloadFile(file: any): Promise<any>;
    };
    title: string;
};
export default base64;
