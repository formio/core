export declare class Evaluator {
    private static templateSettings;
    static noeval: boolean;
    static evaluator(func: any, ...params: any): any;
    static interpolateString(rawTemplate: string, data: any): string;
    static interpolate(rawTemplate: any, data: any): any;
    static evaluate(func: string | any, args: any, context?: any): any;
}
