export declare class BaseEvaluator {
    private static templateSettings;
    static noeval: boolean;
    static evaluator(func: any, ...params: any): any;
    static interpolateString(rawTemplate: string, data: any, options?: any): string;
    static interpolate(rawTemplate: any, data: any, options?: any): any;
    /**
     * Evaluate a method.
     *
     * @param func
     * @param args
     * @return {*}
     */
    static evaluate(func: any, args?: any, ret?: any, interpolate?: boolean, context?: any, options?: any): any;
    /**
     * Execute a function.
     *
     * @param func
     * @param args
     * @returns
     */
    static execute(func: string | any, args: any, context?: any, options?: any): any;
}
export declare class Evaluator extends BaseEvaluator {
    /**
     * Allow external modules the ability to extend the Evaluator.
     * @param evaluator
     */
    static registerEvaluator(evaluator: any): void;
}
