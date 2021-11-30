import * as _ from '@formio/lodash';

// BaseEvaluator is for extending.
export class BaseEvaluator {
    private static templateSettings = {
        interpolate: /{{([\s\S]+?)}}/g,
        evaluate: /\{%([\s\S]+?)%\}/g,
        escape: /\{\{\{([\s\S]+?)\}\}\}/g
    };
    public static noeval: boolean = false;
    public static evaluator(func: any, ...params: any) {
        if (Evaluator.noeval) {
            console.warn('No evaluations allowed for this renderer.');
            return _.noop;
        }
        if (typeof func === 'function') {
            return func;
        }
        if (typeof params[0] === 'object') {
            params = _.keys(params[0]);
        }
        return new Function(...params, func);
    };

    public static interpolateString(rawTemplate: string, data: any) {
        return rawTemplate.replace(/({{\s*(.*?)\s*}})/g, (match, $1, $2) => {
            // If this is a function call and we allow evals.
            if ($2.indexOf('(') !== -1) {
                return $2.replace(/([^\(]+)\(([^\)]+)\s*\);?/, (evalMatch: any, funcName: string, args: any) => {
                    funcName = _.trim(funcName);
                    const func = _.get(data, funcName);
                    if (func) {
                        if (args) {
                            args = args.split(',').map((arg: string) => {
                                arg = _.trim(arg);
                                if ((arg.indexOf('"') === 0) || (arg.indexOf("'") === 0)) {
                                    return arg.substring(1, arg.length - 1);
                                }
                                return _.get(data, arg);
                            });
                        }
                        return Evaluator.evaluate(func, args, '', false, data);
                    }
                    return '';
                });
            }
            else {
                let dataPath = $2;
                if ($2.indexOf('?') !== -1) {
                    dataPath = $2.replace(/\?\./g, '.');
                }
                return _.get(data, dataPath);
            }
        });
    }

    public static interpolate(rawTemplate: any, data: any) {
        if (typeof rawTemplate === 'function') {
            try {
                return rawTemplate(data);
            }
            catch (err: any) {
                console.warn('Error interpolating template', err, data);
                return err.message;
            }
        }

        return Evaluator.interpolateString(String(rawTemplate), data);
    };

    /**
     * Evaluate a method.
     *
     * @param func
     * @param args
     * @return {*}
     */
    public static evaluate(func: any, args: any = {}, ret: any = '', interpolate: boolean = false, context: any = {}): any {
        let returnVal = null;
        const component = args.component ? args.component : { key: 'unknown' };
        if (!args.form && args.instance) {
            args.form = _.get(args.instance, 'root._form', {});
        }

        const componentKey = component.key;
        if (typeof func === 'string') {
            if (ret) {
                func += `;return ${ret}`;
            }

            if (interpolate) {
                func = BaseEvaluator.interpolate(func, args);
            }

            try {
                func = Evaluator.evaluator(func, args, context);
                args = _.values(args);
            }
            catch (err) {
                console.warn(`An error occured within the custom function for ${componentKey}`, err);
                returnVal = null;
                func = false;
            }
        }

        if (typeof func === 'function') {
            try {
                returnVal = Evaluator.execute(func, args, context);
            }
            catch (err) {
                returnVal = null;
                console.warn(`An error occured within custom function for ${componentKey}`, err);
            }
        }
        else if (func) {
            console.warn(`Unknown function type for ${componentKey}`);
        }
        return returnVal;
    }

    /**
     * Execute a function.
     *
     * @param func
     * @param args
     * @returns
     */
    public static execute(func: string | any, args: any, context: any = {}) {
        if (Evaluator.noeval) {
            console.warn('No evaluations allowed for this renderer.');
            return _.noop;
        }
        return Array.isArray(args) ? func.apply(context, args) : func.call(context, args);
    };
}

// The extendable evaluator
export class Evaluator extends BaseEvaluator {
    /**
     * Allow external modules the ability to extend the Evaluator.
     * @param evaluator
     */
    public static registerEvaluator(evaluator: any) {
        Object.keys(evaluator).forEach((key) => {
            (Evaluator as any)[key] = evaluator[key];
        });
    }
}
