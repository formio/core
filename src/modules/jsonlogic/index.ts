import { normalizeContext } from 'utils/formUtil';
import { jsonLogic } from './jsonLogic';
import { Evaluator, EvaluatorOptions, EvaluatorContext } from 'utils/Evaluator';
export class JSONLogicEvaluator extends Evaluator {
  public static evaluate(
    func: any,
    args: any = {},
    ret: any = '',
    interpolate: boolean = false,
    context: any = {},
    options: EvaluatorOptions = {},
  ) {
    let returnVal = null;
    if (typeof func === 'object') {
      try {
        returnVal = jsonLogic.apply(func, args);
      } catch (err) {
        returnVal = null;
        console.warn(`An error occured within JSON Logic`, err);
      }
    } else {
      returnVal = Evaluator.evaluate(func, args, ret, interpolate, context, options);
    }
    return returnVal;
  }
}

export type EvaluatorFn = (context: EvaluatorContext) => any;

export function evaluate(
  context: EvaluatorContext,
  evaluation: string,
  ret: string = 'result',
  evalContextFn?: EvaluatorFn,
  options: EvaluatorOptions = {},
) {
  const { evalContext, instance } = context;
  const evalContextValue = evalContext
    ? evalContext(normalizeContext(context))
    : normalizeContext(context);
  if (evalContextFn) {
    evalContextFn(evalContextValue);
  }
  if (instance && (instance as any).evaluate) {
    return (instance as any).evaluate(evaluation, evalContextValue, ret, false, options);
  }
  return (JSONLogicEvaluator as any).evaluate(
    evaluation,
    evalContextValue,
    ret,
    false,
    context,
    options,
  );
}

export function interpolate(
  context: EvaluatorContext,
  evaluation: string,
  evalContextFn?: EvaluatorFn,
): string {
  const { evalContext, instance } = context;
  const evalContextValue = evalContext
    ? evalContext(normalizeContext(context))
    : normalizeContext(context);
  if (evalContextFn) {
    evalContextFn(evalContextValue);
  }
  if (instance && (instance as any).evaluate) {
    return (instance as any).interpolate(evaluation, evalContextValue, {
      noeval: true,
    });
  }
  return (JSONLogicEvaluator as any).interpolate(evaluation, evalContextValue, {
    noeval: true,
  });
}

export * from './jsonLogic';
export const JSONLogicModule = {
  evaluator: JSONLogicEvaluator,
};
