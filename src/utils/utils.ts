import { isBoolean, isEmpty, isObject, isPlainObject, isString } from 'lodash';
import { EvaluatorOptions, Evaluator } from './Evaluator';
import { isComponentNestedDataType, normalizeContext } from './formUtil';
import {
  AddressComponent,
  AddressComponentDataObject,
  Component,
  DayComponent,
  ContainerComponent,
  PassedComponentInstance,
  ResourceToDomOptions,
} from 'types';

/**
 * Escapes RegEx characters in provided String value.
 *
 * @param {String} value
 *   String for escaping RegEx characters.
 * @returns {string}
 *   String with escaped RegEx characters.
 */
export function escapeRegExCharacters(value: string) {
  return value.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

/**
 * Determines the boolean value of a setting.
 *
 * @param value
 * @return {boolean}
 */
export function boolValue(value: any) {
  if (isBoolean(value)) {
    return value;
  } else if (isString(value)) {
    return value.toLowerCase() === 'true';
  } else {
    return !!value;
  }
}

/**
 * Unescape HTML characters like &lt, &gt, &amp and etc.
 * @param str
 * @returns {string}
 */
export function unescapeHTML(str: string) {
  if (typeof window === 'undefined' || !('DOMParser' in window)) {
    return str;
  }

  const doc = new window.DOMParser().parseFromString(str, 'text/html');
  return doc.documentElement.textContent;
}

export function attachResourceToDom(options: ResourceToDomOptions) {
  const { name, formio, onload, rootElement, onerror } = options;
  let { src } = options;
  src = Array.isArray(src) ? src : [src];
  src.forEach((lib: any) => {
    let attrs: any = {};
    let elementType = '';
    if (typeof lib === 'string') {
      lib = {
        type: 'script',
        src: lib,
      };
    }
    switch (lib.type) {
      case 'script':
        elementType = 'script';
        attrs = {
          src: lib.src,
          type: 'text/javascript',
          defer: true,
          async: true,
          referrerpolicy: 'origin',
        };
        break;
      case 'styles':
        elementType = 'link';
        attrs = {
          href: lib.src,
          rel: 'stylesheet',
        };
        break;
    }

    // Add the script to the top of the page.
    const element = document.createElement(elementType);
    if (element.setAttribute) {
      for (const attr in attrs) {
        element.setAttribute(attr, attrs[attr]);
      }
    }
    if (onload) {
      element.addEventListener('load', () => {
        formio.libraries[name].loaded = true;
        onload(formio.libraries[name].ready);
      });
    }

    element.addEventListener('error', (e) => {
      console.warn(`Unable to load script ${name}`);
      if (typeof onerror === 'function') {
        onerror(e);
      }
    });

    if (rootElement) {
      rootElement.insertAdjacentElement('afterend', element);
      return;
    }
    const { head } = document;
    if (head) {
      head.appendChild(element);
    }
  });
}

type EvaluatorContext = {
  evalContext?: (context: any) => any;
  instance?: PassedComponentInstance;
  [key: string]: any;
};
export type EvaluatorFn = (context: EvaluatorContext) => any;

/**
 * A convenience function that wraps Evaluator.evaluate and normalizes context values
 * @param evaluation - The code string to evaluate
 * @param context - The processor context
 * @param ret - The return value
 * @param interpolate - Whether or not to interpolate the code string before evaluating
 * @param evalContextFn - A callback to mutate the context value after it has been normalized
 * @param options - Options to pass to the Evaluator
 * @returns {*} - Returns the result of the evaluation
 */
export function evaluate(
  evaluation: string | ((...args: any) => any),
  context: EvaluatorContext,
  ret: string = 'result',
  interpolate: boolean = false,
  evalContextFn?: EvaluatorFn,
  options: EvaluatorOptions = {},
) {
  const { instance, form } = context;
  const normalizedContext = normalizeContext(context);
  if (evalContextFn) {
    evalContextFn(normalizedContext);
  }
  if (form?.module) {
    options = { ...options, formModule: form.module };
  }
  if (instance && instance.evaluate) {
    return instance.evaluate(evaluation, normalizedContext, ret, interpolate, options);
  }
  return Evaluator.evaluate(evaluation, normalizedContext, ret, interpolate, context, options);
}

export function interpolate(
  evaluation: string,
  context: EvaluatorContext,
  evalContextFn?: EvaluatorFn,
): string {
  const { instance } = context;
  const normalizedContext = normalizeContext(context);
  if (evalContextFn) {
    evalContextFn(normalizedContext);
  }
  if (instance && instance.interpolate) {
    return instance.interpolate(evaluation, normalizedContext, {
      noeval: true,
    });
  }
  return Evaluator.interpolate(evaluation, normalizedContext, {
    noeval: true,
  });
}

export function hasValue(value: any): boolean {
  if (isObject(value)) {
    return !isEmpty(value);
  }

  return (typeof value === 'number' && !Number.isNaN(value)) || !!value;
}

export function doesArrayDataHaveValue(dataValue: any[] = []): boolean {
  if (!Array.isArray(dataValue)) {
    return !!dataValue;
  }

  if (!dataValue.length) {
    return false;
  }

  const isArrayDataComponent = dataValue.every(isPlainObject);

  if (isArrayDataComponent) {
    return dataValue.some((value) => Object.values(value).some(hasValue));
  }

  return dataValue.some(hasValue);
}

export function isEmptyObject(obj: any) {
  return !!obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function valueIsPresent(
  value: any,
  considerFalseTruthy: boolean,
  shouldSkipObjectValue?: boolean,
): boolean {
  // Evaluate for 3 out of 6 falsy values ("", null, undefined), don't check for 0
  // and only check for false under certain conditions
  if (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && !value.trim()) ||
    (!considerFalseTruthy && value === false)
  ) {
    return false;
  }
  // Evaluate for empty object
  else if (isEmptyObject(value)) {
    return false;
  }
  // Evaluate for empty array
  else if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  // Recursively evaluate
  else if (typeof value === 'object' && !shouldSkipObjectValue) {
    return Object.values(value).some((val) =>
      valueIsPresent(val, considerFalseTruthy, shouldSkipObjectValue),
    );
  }
  // If value is an array, check it's children have value
  else if (Array.isArray(value) && value.length) {
    return doesArrayDataHaveValue(value);
  }
  return true;
}

export function isAddressComponent(component: any): component is AddressComponent {
  return component.type === 'address';
}

export function isDayComponent(component: any): component is DayComponent {
  return component.type === 'day';
}

export function isContainerComponent(component: any): component is ContainerComponent {
  return component.type === 'container';
}

export function isAddressComponentDataObject(value: any): value is AddressComponentDataObject {
  return (
    value !== null &&
    typeof value === 'object' &&
    value.mode &&
    value.address &&
    typeof value.address === 'object'
  );
}

// Checkboxes and selectboxes consider false to be falsy, whereas other components with
// settable values (e.g. radio, select, datamap, container, etc.) consider it truthy
export function isComponentThatCannotHaveFalseValue(component: any): boolean {
  return component.type === 'checkbox' || component.type === 'selectboxes';
}

export function componentHasValue(component: Component, value: any): boolean {
  if (isAddressComponent(component) && isAddressComponentDataObject(value)) {
    return isEmptyObject(value.address)
      ? false
      : Object.entries(value.address)
            .filter(([key]) => !['address2'].includes(key))
            .every(([, val]) => !!val)
        ? true
        : false;
  } else if (isDayComponent(component) && value === '00/00/0000') {
    return false;
  } else if (isComponentThatCannotHaveFalseValue(component)) {
    return !valueIsPresent(value, false, isComponentNestedDataType(component)) ? false : true;
  }
  return !valueIsPresent(value, true, isComponentNestedDataType(component) && !isContainerComponent(component)) ? false : true;
}
