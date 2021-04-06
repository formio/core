/**
 * The component JSON schema.
 */
export interface ComponentSchema {
    type: string;
    key: string;
    label?: string;
}
/**
 * Component options.
 */
export interface ComponentOptions {
    language?: string;
    i18n?: any;
    namespace?: string;
    hooks?: any;
    template?: string;
    noInit?: boolean;
}
export interface ComponentInterface {
    new (component?: any, options?: any, data?: any): any;
}
export declare function ComponentWithModel(ModelClass: any): (...props: any) => ComponentInterface;
export declare const Component: (...props: any) => ComponentInterface;
