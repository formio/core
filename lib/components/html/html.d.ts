export declare const HTMLProperties: {
    type: string;
    schema: {
        tag: string;
        content: string;
        attrs: never[];
        className: string;
    };
    template: (ctx: any) => string;
};
export declare class HTMLComponent {
    component?: any;
    options?: any;
    data?: any;
    [x: string]: any;
    constructor(component?: any, options?: any, data?: any);
    getAttributes(): string;
    renderContext(extend?: any): any;
}
