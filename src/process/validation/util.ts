import { FieldError } from 'error';
import { Component } from 'types';
import { Evaluator, unescapeHTML } from 'utils';
import { VALIDATION_ERRORS } from './i18n';
import _isEmpty from 'lodash/isEmpty';
import _isObject from 'lodash/isObject';
import _isPlainObject from 'lodash/isPlainObject';

export function isComponentPersistent(component: Component) {
  return component.persistent ? component.persistent : true;
}

export function isComponentProtected(component: Component) {
  return component.protected ? component.protected : false;
}

export function isEmptyObject(obj: any) {
  return !!obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

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

export function isObject(obj: any): obj is object {
  return obj != null && (typeof obj === 'object' || typeof obj === 'function');
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

export const hasValue = (value: any) => {
  if (_isObject(value)) {
    return !_isEmpty(value);
  }

  return (typeof value === 'number' && !Number.isNaN(value)) || !!value;
};

export const doesArrayDataHaveValue = (dataValue: any[] = []): boolean => {
  if (!Array.isArray(dataValue)) {
    return !!dataValue;
  }

  if (!dataValue.length) {
    return false;
  }

  const isArrayDataComponent = dataValue.every(_isPlainObject);

  if (isArrayDataComponent) {
    return dataValue.some((value) => Object.values(value).some(hasValue));
  }

  return dataValue.some(hasValue);
};
