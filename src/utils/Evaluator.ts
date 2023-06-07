import * as _ from '@formio/lodash';

// BaseEvaluator is for extending.
export class BaseEvaluator {
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

    public static interpolateString(rawTemplate: string, data: any, options: any = {}) {
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
                        return Evaluator.evaluate(func, args, '', false, data, options);
                    }
                    return '';
                });
            }
            else {
                let dataPath = $2;
                if ($2.indexOf('?') !== -1) {
                    dataPath = $2.replace(/\?\./g, '.');
                }
                // Allow for conditional values.
                const parts = dataPath.split('||').map((item: string) => item.trim());
                let value = '';
                let path = '';
                for (let i = 0; i < parts.length; i++) {
                    path = parts[i];
                    value = _.get(data, path);
                    if (value) {
                        break;
                    }
                }
                if (options.data) {
                    _.set(options.data, path, value);
                }
                return value;
            }
        });
    }

    public static interpolate(rawTemplate: any, data: any, options: any = {}) {
        if (typeof rawTemplate === 'function') {
            try {
                return rawTemplate(data);
            }
            catch (err: any) {
                console.warn('Error interpolating template', err, data);
                return err.message;
            }
        }

        return Evaluator.interpolateString(String(rawTemplate), data, options);
    };

    /**
     * Evaluate a method.
     *
     * @param func
     * @param args
     * @return {*}
     */
    public static evaluate(
        func: any,
        args: any = {},
        ret: any = '',
        interpolate: boolean = false,
        context: any = {},
        options: any = {}
    ): any {
        let returnVal = null;
        options = _.isObject(options) ? options : { noeval: options };
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
                func = BaseEvaluator.interpolate(func, args, options);
            }

            try {
                if (Evaluator.noeval || options.noeval) {
                    func = _.noop;
                }
                else {
                    func = Evaluator.evaluator(func, args, context);
                }
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
                returnVal = Evaluator.execute(func, args, context, options);
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
    public static execute(func: string | any, args: any, context: any = {}, options: any = {}) {
        options = _.isObject(options) ? options : { noeval: options };
        if (Evaluator.noeval || options.noeval) {
            console.warn('No evaluations allowed for this renderer.');
            return;
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
