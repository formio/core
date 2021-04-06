import { BaseEvaluator } from '../../util/Evaluator';
import rules from './rules';
import { jsonLogic } from './jsonLogic';
export class JSONLogicEvaluator extends BaseEvaluator {
    public static evaluate(func: any, args: any = {}, ret: any = '', tokenize: boolean = false, context: any = {}) {
        let returnVal = null;
        if (typeof func === 'object') {
            try {
                returnVal = jsonLogic.apply(func, args);
            }
            catch (err) {
                returnVal = null;
                console.warn(`An error occured within JSON Logic`, err);
            }
        }
        else {
            returnVal = BaseEvaluator.evaluate(func, args, ret, tokenize, context);
        }
        return returnVal;
    }
}

export default {
    evaluator: JSONLogicEvaluator,
    rules: rules,
    jsonLogic: jsonLogic
}