import { BaseEvaluator } from '../../util/Evaluator';
export declare class JSONLogicEvaluator extends BaseEvaluator {
    static evaluate(func: any, args?: any, ret?: any, tokenize?: boolean, context?: any): any;
}
declare const _default: {
    evaluator: typeof JSONLogicEvaluator;
    rules: {
        json: typeof import("./rules/JSON").JSONRule;
    };
    jsonLogic: any;
};
export default _default;
