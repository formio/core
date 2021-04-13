/**
 * A base class for a data table.
 */
export declare class DataTable {
    component?: any;
    options?: any;
    data?: any;
    [x: string]: any;
    constructor(component?: any, options?: any, data?: any);
    renderClasses(): string;
    renderContext(extend?: any): any;
}
export declare class DataTableComponent extends DataTable {
}
