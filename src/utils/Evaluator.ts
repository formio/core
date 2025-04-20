import { noop, trim, keys, get, set, isObject, values } from 'lodash';
import { jsonLogic } from './jsonlogic';

export type EvaluatorOptions = {
  noeval?: boolean;
  data?: any;
  formModule?: string;
};

export class DefaultEvaluator {
  noeval: boolean;
  templateSettings = {
    interpolate: /{{([\s\S]+?)}}/g,
    evaluate: /\{%([\s\S]+?)%\}/g,
    escape: /\{\{\{([\s\S]+?)\}\}\}/g,
  };

  constructor(options: EvaluatorOptions = {}) {
    this.noeval = !!options.noeval;
  }

  evaluator(func: any, ...params: any) {
    if (this.noeval) {
      console.warn('No evaluations allowed for this renderer.');
      return noop;
    }
    if (typeof func === 'function') {
      return func;
    }
    if (typeof params[0] === 'object') {
      params = keys(params[0]);
    }
    return new Function(...params, func);
  }

  interpolateString(rawTemplate: string, data: any, options: EvaluatorOptions = {}) {
    if (!rawTemplate) {
      return '';
    }
    if (typeof rawTemplate !== 'string') {
      return (rawTemplate as any).toString();
    }
    return rawTemplate.replace(/({{\s*(.*?)\s*}})/g, (match, $1, $2) => {
      // If this is a function call and we allow evals.
      if ($2.indexOf('(') !== -1 && !(this.noeval || options.noeval)) {
        return $2.replace(
          /([^(]+)\(([^)]+)\s*\);?/,
          (evalMatch: any, funcName: string, args: any) => {
            funcName = trim(funcName);
            const func = get(data, funcName);
            if (func) {
              if (args) {
                args = args.split(',').map((arg: string) => {
                  arg = trim(arg);
                  if (arg.indexOf('"') === 0 || arg.indexOf("'") === 0) {
                    return arg.substring(1, arg.length - 1);
                  }
                  return get(data, arg);
                });
              }
              return this.evaluate(func, args, '', false, data, options);
            }
            return '';
          },
        );
      } else {
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
          value = get(data, path);
          if (value) {
            break;
          }
        }
        if (options.data) {
          set(options.data, path, value);
        }
        return value;
      }
    });
  }

  interpolate(rawTemplate: any, data: any, options: EvaluatorOptions = {}) {
    if (typeof rawTemplate === 'function' && !(this.noeval || options.noeval)) {
      try {
        return rawTemplate(data);
      } catch (err: any) {
        console.warn('Error interpolating template', err, data);
        return err.message;
      }
    }

    return this.interpolateString(String(rawTemplate), data, options);
  }

  /**
   * Evaluate a method.
   *
   * @param func
   * @param args
   * @return {*}
   */
  evaluate(
    func: any,
    args: any = {},
    ret: any = '',
    interpolate: boolean = false,
    context: any = {},
    options: EvaluatorOptions = {},
  ): any {
    let returnVal = null;
    options = isObject(options) ? options : { noeval: options };
    const component = args.component ? args.component : { key: 'unknown' };
    if (!args.form && args.instance) {
      args.form = get(args.instance, 'root._form', {});
    }
    const componentKey = component.key;
    if (typeof func === 'object') {
      try {
        returnVal = jsonLogic.apply(func, args);
      } catch (err) {
        returnVal = null;
        console.warn(`An error occured within JSON Logic`, err);
      }
      return returnVal;
    } else if (typeof func === 'string') {
      if (ret) {
        func = `var ${ret};${func};return ${ret}`;
      }
      if (options.formModule) {
        func = `const module = ${options.formModule};
          if (module.options?.form?.evalContext) {
            Object.keys(module.options.form.evalContext).forEach((key) => globalThis[key] = module[key]);
          }
          ${func};
        `;
      }

      if (interpolate) {
        func = this.interpolate(func, args, options);
      }

      try {
        if (this.noeval || options.noeval) {
          func = noop;
        } else {
          func = this.evaluator(func, args, context);
        }
        args = values(args);
      } catch (err) {
        console.warn(`An error occured within the custom function for ${componentKey}`, err);
        returnVal = null;
        func = false;
      }
    }

    if (typeof func === 'function') {
      try {
        returnVal = this.execute(func, args, context, options);
      } catch (err) {
        returnVal = null;
        console.warn(`An error occured within custom function for ${componentKey}`, err);
      }
    } else if (func) {
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
  execute(func: string | any, args: any, context: any = {}, options: EvaluatorOptions = {}) {
    options = isObject(options) ? options : { noeval: options };
    if (this.noeval || options.noeval) {
      console.warn('No evaluations allowed for this renderer.');
      return;
    }
    return Array.isArray(args) ? func.apply(context, args) : func.call(context, args);
  }
}

// The mutable singleton instance
export let Evaluator: DefaultEvaluator = new DefaultEvaluator();

export function registerEvaluator(override: DefaultEvaluator) {
  Evaluator = override;
}
