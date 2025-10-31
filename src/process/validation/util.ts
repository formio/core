import { FieldError } from 'error';
import { Evaluator, unescapeHTML } from 'utils';
import { VALIDATION_ERRORS } from './i18n';

export function toBoolean(value: any) {
  switch (typeof value) {
    case 'string':
      if (value === 'true' || value === '1') {
        return true;
      } else if (value === 'false' || value === '0') {
        return false;
      } else {
        throw `Cannot coerce string ${value} to boolean}`;
      }
    case 'boolean':
      return value;
    default:
      return !!value;
  }
}

export function isPromise(value: any): value is Promise<any> {
  return (
    value &&
    value.then &&
    typeof value.then === 'function' &&
    Object.prototype.toString.call(value) === '[object Promise]'
  );
}

const getCustomErrorMessage = ({ errorKeyOrMessage, context }: FieldError): string =>
  context.component?.errors?.[errorKeyOrMessage] || '';

/**
 * Interpolates @formio/core errors so that they are compatible with the renderer
 * @param {FieldError[]} errors
 * @param firstPass
 * @returns {[]}
 */
export const interpolateErrors = (errors: FieldError[], lang: string = 'en') => {
  return errors.map((error) => {
    const { errorKeyOrMessage, context } = error;
    const i18n = VALIDATION_ERRORS[lang] || {};
    const toInterpolate =
      getCustomErrorMessage(error) || i18n[errorKeyOrMessage] || errorKeyOrMessage;
    const paths: any = [];
    context.path.split('.').forEach((part) => {
      const match = part.match(/\[([0-9]+)\]$/);
      if (match) {
        paths.push(part.substring(0, match.index));
        paths.push(parseInt(match[1]));
      } else {
        paths.push(part);
      }
    });
    return {
      message: unescapeHTML(Evaluator.interpolateString(toInterpolate, context)),
      level: error.level,
      path: paths,
      context: {
        validator: error.ruleName,
        hasLabel: context.hasLabel,
        key: context.component.key,
        label: context.component.label || context.component.placeholder || context.component.key,
        path: context.path,
        value: context.value,
        setting: context.setting,
        index: context.index || 0,
      },
    };
  });
};
