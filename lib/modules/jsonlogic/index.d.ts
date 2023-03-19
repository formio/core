import { BaseEvaluator } from '@formio/utils';
import { jsonLogic } from './jsonLogic';
export declare class JSONLogicEvaluator extends BaseEvaluator {
    static evaluate(func: any, args?: any, ret?: any, tokenize?: boolean, context?: any): any;
}
declare const _default: {
    evaluator: typeof JSONLogicEvaluator;
    rules: {
        json: typeof import("./rules/JSON").JSONRule;
    };
    jsonLogic: typeof jsonLogic;
};
export default _default;
