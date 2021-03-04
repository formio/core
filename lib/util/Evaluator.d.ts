export declare class Evaluator {
    static noeval: boolean;
    static evaluator(func: any, ...params: any): Function;
    static interpolateString(rawTemplate: string, data: any): string;
    static interpolate(rawTemplate: any, data: any): any;
}
