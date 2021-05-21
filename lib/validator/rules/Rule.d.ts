export declare class Rule {
    component?: any;
    settings?: any;
    constructor(component?: any, settings?: any);
    check(value?: any, options?: any): Promise<boolean>;
}
