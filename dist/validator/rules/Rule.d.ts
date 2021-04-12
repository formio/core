export declare class Rule {
    component?: any;
    settings?: any;
    config?: any;
    constructor(component?: any, settings?: any, config?: any);
    check(value?: any, data?: any, row?: any): Promise<boolean>;
}
