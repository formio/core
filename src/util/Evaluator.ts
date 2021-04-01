import * as _ from '@formio/lodash';

// BaseEvaluator is for extending.
export class BaseEvaluator {
    public static noeval: boolean = false;
    public static evaluator(func: any, ...params: any) {
        if (Evaluator.noeval) {
            console.warn('No evaluations allowed for this renderer.');
            return _.noop;
        }

        if (typeof params[0] === 'object') {
            params = _.keys(params[0]);
        }
        return new Function(...params, func);
    };

    public static interpolateString(rawTemplate: string, data: any) {
        return rawTemplate.replace(/({{\s*(.*?)\s*}})/g, (match, $1, $2) => _.get(data, $2));
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

    /**
     * Evaluate a method.
     *
     * @param func
     * @param args
     * @return {*}
     */
    public static evaluate(func: any, args: any = {}, ret: any = '', tokenize: boolean = false): any {
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

            if (tokenize) {
                // Replace all {{ }} references with actual data.
                func = func.replace(/({{\s+(.*)\s+}})/, (match, $1, $2) => {
                    if ($2.indexOf('data.') === 0) {
                        return _.get(args.data, $2.replace('data.', ''));
                    }
                    else if ($2.indexOf('row.') === 0) {
                        return _.get(args.row, $2.replace('row.', ''));
                    }

                    // Support legacy...
                    return _.get(args.data, $2);
                });
            }

            try {
                func = Evaluator.evaluator(func, args);
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
                returnVal = Evaluator.execute(func, args);
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
    public static execute(func: any, args: any) {
        return Array.isArray(args) ? func(...args) : func(args);
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
