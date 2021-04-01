import * as _ from './lodash';
export class Evaluator {
    private static templateSettings = {
        interpolate: /{{([\s\S]+?)}}/g,
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
                        return Evaluator.evaluate(func, args, data);
                    }
                    return '';
                });
            }
            else {
                return _.get(data, $2);
            }
        });
    }

    public static interpolate(rawTemplate: any, data: any) {
        if (typeof rawTemplate === 'function') {
            try {
                return rawTemplate(data);
            }
            catch (err) {
                console.warn('Error interpolating template', err, data);
                return err.message;
            }
        }

        return Evaluator.interpolateString(String(rawTemplate), data);
    };

    public static evaluate(func: string | any, args: any, context: any = {}) {
        if (Evaluator.noeval) {
            return null;
        }
        return Array.isArray(args) ? func.apply(context, args) : func.call(context, args);
    }
}
