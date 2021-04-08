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
/**
 * Base class for HTML based components.
 */
export declare class HTML {
    component?: any;
    options?: any;
    data?: any;
    [x: string]: any;
    constructor(component?: any, options?: any, data?: any);
    getAttributes(): string;
    renderContext(extend?: any): any;
}
export declare class HTMLComponent extends HTML {
}
