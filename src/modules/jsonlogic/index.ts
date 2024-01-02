import { BaseEvaluator } from 'utils';
import { jsonLogic } from './jsonLogic';
class JSONLogicEvaluator extends BaseEvaluator {
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

export type EvaluatorContext = {
    evalContext?: (context: any) => any;
    instance?: any;
    [key: string]: any;
};

export type EvaluatorFn = (context: EvaluatorContext) => any;

export function evaluate(
    context: EvaluatorContext, 
    evaluation: string, 
    ret: string = 'result', 
    evalContextFn?: EvaluatorFn,
    fnName?: string,
    options: any = {}
) {
    const { evalContext, instance } = context;
    const evalContextValue = evalContext ? evalContext(context) : context;
    if (evalContextFn) {
        evalContextFn(evalContextValue);
    }
    fnName = fnName || 'evaluate';
    if (instance && (instance as any)[fnName]) {
        evaluation = `var ${ret}; ${ret} = ${evaluation}; return ${ret}`;
        return (instance as any)[fnName](evaluation, evalContextValue, options);
    }
    return (JSONLogicEvaluator as any)[fnName](evaluation, evalContextValue, ret);
}

export function interpolate(
    context: EvaluatorContext, 
    evaluation: string, 
    evalContextFn?: EvaluatorFn
) : string {
    return evaluate(context, evaluation, undefined, evalContextFn, 'interpolate', {
        noeval: true
    });
}

export default {
    evaluator: JSONLogicEvaluator,
    jsonLogic: jsonLogic
}
