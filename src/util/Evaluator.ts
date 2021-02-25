import * as _ from './util';
export class Evaluator {
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
}
