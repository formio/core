export declare const setXhrHeaders: (formio: any, xhr: any) => void;
declare const XHR: {
    trim(text: string): string;
    path(items: any): any;
    upload(formio: any, type: any, xhrCb: any, file: any, fileName: any, dir: any, progressCallback: any, groupPermissions: any, groupId: any, abortCallback: any): Promise<unknown>;
};
export default XHR;
