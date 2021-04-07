export interface ModelInterface {
    component?: any;
    options?: any;
    data?: any;
    new (component?: any, options?: any, data?: any): any;
}
export interface ModelDecoratorInterface {
    (BaseClass?: ModelInterface): ModelInterface;
}
export declare function Model(props?: any): ModelDecoratorInterface;
