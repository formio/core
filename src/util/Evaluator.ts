import * as _ from './lodash';
import template from 'lodash.template';
export class Evaluator {
    private static templateSettings = {
        interpolate: /{{([\s\S]+?)}}/g,
    };

    private static tryParseFunction(rawTemplate: string, data: any): string {
        try {
            const compiled = template(rawTemplate, this.templateSettings);
            return compiled(data);
        }
        catch (err) {
            console.warn('Error iterpolating template', err, data);
            return '';
        }
    }

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
        return rawTemplate.replace(/({{\s*(.*?)\s*}})/g, (match, $1, $2) => {
            const result = _.get(data, $2);
            if (!result) {
                return this.tryParseFunction(match, data);
            }
            return result;
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
}
