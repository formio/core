export declare class BaseEvaluator {
    private static templateSettings;
    static noeval: boolean;
    static evaluator(func: any, ...params: any): any;
    static interpolateString(rawTemplate: string, data: any): string;
    static interpolate(rawTemplate: any, data: any): any;
    /**
     * Evaluate a method.
     *
     * @param func
     * @param args
     * @return {*}
     */
    static evaluate(func: any, args?: any, ret?: any, interpolate?: boolean, context?: any): any;
    /**
     * Execute a function.
     *
     * @param func
     * @param args
     * @returns
     */
    static execute(func: string | any, args: any, context?: any): any;
}
export declare class Evaluator extends BaseEvaluator {
    /**
     * Allow external modules the ability to extend the Evaluator.
     * @param evaluator
     */
    static registerEvaluator(evaluator: any): void;
}
