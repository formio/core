export declare class BaseEvaluator {
    static noeval: boolean;
    static evaluator(func: any, ...params: any): Function;
    static interpolateString(rawTemplate: string, data: any): string;
    static interpolate(rawTemplate: any, data: any): any;
    /**
     * Evaluate a method.
     *
     * @param func
     * @param args
     * @return {*}
     */
    static evaluate(func: any, args?: any, ret?: any, tokenize?: boolean): any;
    /**
     * Execute a function.
     *
     * @param func
     * @param args
     * @returns
     */
    static execute(func: any, args: any): any;
}
export declare class Evaluator extends BaseEvaluator {
    /**
     * Allow external modules the ability to extend the Evaluator.
     * @param evaluator
     */
    static registerEvaluator(evaluator: any): void;
}
