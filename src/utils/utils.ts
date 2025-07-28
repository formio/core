import { isBoolean, isString } from 'lodash';
import { EvaluatorOptions, Evaluator } from './Evaluator';
import { normalizeContext } from './formUtil';
import { PassedComponentInstance, ResourceToDomOptions } from 'types';

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
  const { name, formio, onload, rootElement } = options;
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
  evaluation: string,
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
