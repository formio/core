import { ModelDecoratorInterface } from '@formio/model';
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
export declare function Component(props?: any): ModelDecoratorInterface;
