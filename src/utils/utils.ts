import { isBoolean, isString } from 'lodash';
import { BaseComponent, Component, ResourceToDomOptions } from 'types';

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

export function registerEphemeralState(
  component: Component,
  name: keyof NonNullable<BaseComponent['ephemeralState']>,
  value: any,
) {
  if (!component.ephemeralState) {
    Object.defineProperty(component, 'ephemeralState', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: {},
    });
  }
  Object.defineProperty(component.ephemeralState, name, {
    enumerable: false,
    writable: false,
    configurable: true,
    value,
  });
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

export function resetEphemeralState(component: Component) {
  if (component.ephemeralState) {
    delete component.ephemeralState;
  }
}
