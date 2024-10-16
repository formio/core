import {
  last,
  get,
  set,
  isEmpty,
  isNil,
  isObject,
  has,
  isString,
  forOwn,
  round,
  chunk,
  pad,
  isPlainObject,
  isArray,
  isEqual,
  trim,
  isBoolean,
  omit,
  every,
} from 'lodash';
import { compare, applyPatch } from 'fast-json-patch';

import {
  CheckboxComponent,
  DataGridComponent,
  EditGridComponent,
  DataTableComponent,
  DateTimeComponent,
  TextAreaComponent,
  TextFieldComponent,
  HasChildComponents,
  SelectBoxesComponent,
  Component,
  DataObject,
  ColumnsComponent,
  TableComponent,
  LegacyConditional,
  JSONConditional,
  SimpleConditional,
  AddressComponent,
  SelectComponent,
} from 'types';
import { Evaluator } from '../Evaluator';
import { eachComponent } from './eachComponent';
import { eachComponentData } from './eachComponentData';
import { eachComponentAsync } from './eachComponentAsync';
import { eachComponentDataAsync } from './eachComponentDataAsync';

/**
 * Flatten the form components for data manipulation.
 *
 * @param {Object} components
 *   The components to iterate.
 * @param {Boolean} includeAll
 *   Whether or not to include layout components.
 *
 * @returns {Object}
 *   The flattened components map.
 */
export function flattenComponents(components: Component[], includeAll: boolean = false) {
  const flattened: any = {};
  eachComponent(
    components,
    (component: any, path: string) => {
      flattened[path] = component;
    },
    includeAll,
  );
  return flattened;
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Make a filename guaranteed to be unique.
 * @param name
 * @param template
 * @param evalContext
 * @returns {string}
 */
export function uniqueName(name: string, template?: string, evalContext?: any) {
  template = template || '{{fileName}}-{{guid}}';
  //include guid in template anyway, to prevent overwriting issue if filename matches existing file
  if (!template.includes('{{guid}}')) {
    template = `${template}-{{guid}}`;
  }
  const parts = name.split('.');
  let fileName = parts.slice(0, parts.length - 1).join('.');
  const extension = parts.length > 1 ? `.${last(parts)}` : '';
  //allow only 100 characters from original name to avoid issues with filename length restrictions
  fileName = fileName.substr(0, 100);
  evalContext = Object.assign(evalContext || {}, {
    fileName,
    guid: guid(),
  });
  //only letters, numbers, dots, dashes, underscores and spaces are allowed. Anything else will be replaced with dash
  const uniqueName = `${Evaluator.interpolate(template, evalContext)}${extension}`.replace(
    /[^0-9a-zA-Z.\-_ ]/g,
    '-',
  );
  return uniqueName;
}

/**
 * Defines model types for known components.
 * For now, these will be the only model types supported by the @formio/core library.
 *
 * nestedArray: for components that store their data as an array and have nested components.
 * nestedDataArray: for components that store their data as an array and have nested components, but keeps the value of nested components inside 'data' property.
 * array: for components that store their data as an array.
 * dataObject: for components that store their data in a nested { data: {} } object.
 * object: for components that store their data in an object.
 * map: for components that store their data in a map.
 * content: for components that do not store data.
 * string: for components that store their data as a string.
 * number: for components that store their data as a number.
 * boolean: for components that store their data as a boolean.
 * none: for components that do not store data and should not be included in the submission.
 * any: for components that can store any type of data.
 *
 */
export const MODEL_TYPES_OF_KNOWN_COMPONENTS = {
  nestedArray: ['datagrid', 'editgrid', 'datatable', 'dynamicWizard'],
  nestedDataArray: ['tagpad'],
  dataObject: ['form'],
  object: ['container', 'address'],
  map: ['datamap'],
  content: ['htmlelement', 'content'],
  string: [
    'textfield',
    'password',
    'email',
    'url',
    'phoneNumber',
    'day',
    'datetime',
    'time',
    'signature',
  ],
  number: ['number', 'currency'],
  boolean: ['checkbox', 'radio'],
  none: ['table', 'well', 'columns', 'fieldset', 'panel', 'tabs'],
  any: [
    'survey',
    'captcha',
    'textarea',
    'selectboxes',
    'tags',
    'select',
    'hidden',
    'button',
    'datasource',
    'sketchpad',
    'reviewpage',
    'file',
  ],
};

export function getModelType(component: Component): keyof typeof MODEL_TYPES_OF_KNOWN_COMPONENTS {
  // If the component JSON asserts a model type, use that.
  if (component.modelType) {
    return component.modelType;
  }

  // Otherwise, check for known component types.
  for (const type of Object.keys(
    MODEL_TYPES_OF_KNOWN_COMPONENTS,
  ) as (keyof typeof MODEL_TYPES_OF_KNOWN_COMPONENTS)[]) {
    if (MODEL_TYPES_OF_KNOWN_COMPONENTS[type].includes(component.type)) {
      return type;
    }
  }

  // Otherwise check for components that assert no value.
  if (component.input === false) {
    return 'none';
  }

  // Otherwise default to any.
  return 'any';
}

export function getComponentAbsolutePath(component: Component) {
  const paths = [component.path];
  while (component.parent) {
    component = component.parent;
    // We only need to do this for nested forms because they reset the data contexts for the children.
    if (getModelType(component) === 'dataObject') {
      paths[paths.length - 1] = `data.${paths[paths.length - 1]}`;
      paths.push(component.path);
    }
  }
  return paths.reverse().join('.');
}

export function getComponentPath(component: Component, path: string) {
  const key = getComponentKey(component);
  if (!key) {
    return path;
  }
  if (!path) {
    return key;
  }
  if (path.match(new RegExp(`${key}$`))) {
    return path;
  }
  return getModelType(component) === 'none' ? `${path}.${key}` : path;
}

export function isComponentNestedDataType(component: any): component is HasChildComponents {
  return (
    component.tree ||
    getModelType(component) === 'nestedArray' ||
    getModelType(component) === 'nestedDataArray' ||
    getModelType(component) === 'dataObject' ||
    getModelType(component) === 'object' ||
    getModelType(component) === 'map'
  );
}

export function componentPath(component: Component, parentPath?: string): string {
  parentPath = component.parentPath || parentPath;
  const key = getComponentKey(component);
  if (!key) {
    // If the component does not have a key, then just always return the parent path.
    return parentPath || '';
  }
  return parentPath ? `${parentPath}.${key}` : key;
}

export const componentDataPath = (component: any, parentPath: string, path: string): string => {
  parentPath = component.parentPath || parentPath;
  path = path || componentPath(component, parentPath);
  // See if we are a nested component.
  if (component.components && Array.isArray(component.components)) {
    if (getModelType(component) === 'dataObject') {
      return `${path}.data`;
    }
    if (getModelType(component) === 'nestedArray') {
      return `${path}[0]`;
    }
    if (getModelType(component) === 'nestedDataArray') {
      return `${path}[0].data`;
    }
    if (isComponentNestedDataType(component)) {
      return path;
    }
    return parentPath;
  }
  return path;
};

export const componentFormPath = (component: any, parentPath: string, path: string): string => {
  parentPath = component.parentPath || parentPath;
  path = path || componentPath(component, parentPath);
  if (getModelType(component) === 'dataObject') {
    return `${path}.data`;
  }
  if (isComponentNestedDataType(component)) {
    return path;
  }
  return parentPath;
};

export function getComponentKey(component: Component) {
  if (
    component.type === 'checkbox' &&
    component.inputType === 'radio' &&
    (component as CheckboxComponent).name
  ) {
    return (component as CheckboxComponent).name;
  }
  return component.key;
}

export function getContextualRowPath(component: Component, path: string): string {
  return path.replace(new RegExp(`.?${getComponentKey(component)}$`), '');
}

export function getContextualRowData(component: Component, path: string, data: any): any {
  const rowPath = getContextualRowPath(component, path);
  return rowPath ? get(data, rowPath, null) : data;
}

export function componentInfo(component: any) {
  const hasColumns = component.columns && Array.isArray(component.columns);
  const hasRows = component.rows && Array.isArray(component.rows);
  const hasComps = component.components && Array.isArray(component.components);
  const isContent = getModelType(component) === 'content';
  const isLayout = getModelType(component) === 'none';
  const isInput = !component.hasOwnProperty('input') || !!component.input;
  return {
    hasColumns,
    hasRows,
    hasComps,
    layout: hasColumns || hasRows || (hasComps && !isInput) || isLayout || isContent,
    iterable: hasColumns || hasRows || hasComps || isContent,
  };
}

// Provided components, data, and a key, this will return the components data.
export function getComponentData(components: Component[], data: DataObject, path: string) {
  const compData: any = { component: null, data: null };
  eachComponentData(
    components,
    data,
    (component: Component, data: DataObject, row: any, compPath: string) => {
      if (compPath === path) {
        compData.component = component;
        compData.data = row;
        return true;
      }
    },
  );
  return compData;
}

export function getComponentActualValue(
  component: Component,
  compPath: string,
  data: any,
  row: any,
) {
  // The compPath here will NOT contain the indexes for DataGrids and EditGrids.
  //
  //   a[0].b[2].c[3].d
  //
  // Because of this, we will need to determine our parent component path (not data path),
  // and find the "row" based comp path.
  //
  //   a[0].b[2].c[3].d => a.b.c.d
  //
  let parentInputComponent: any = null;
  let parent = component;
  let rowPath = '';

  while (parent?.parent?.path && !parentInputComponent) {
    parent = parent.parent;
    if (parent.input) {
      parentInputComponent = parent;
    }
  }

  if (parentInputComponent) {
    const parentCompPath = parentInputComponent.path.replace(/\[[0-9]+\]/g, '');
    rowPath = compPath.replace(parentCompPath, '');
    rowPath = trim(rowPath, '. ');
  }

  let value = null;
  if (data) {
    value = get(data, compPath);
  }
  if (rowPath && row && isNil(value)) {
    value = get(row, rowPath);
  }
  if (isNil(value) || (isObject(value) && isEmpty(value))) {
    value = '';
  }
  return value;
}

/**
 * Determine if a component is a layout component or not.
 *
 * @param {Object} component
 *   The component to check.
 *
 * @returns {Boolean}
 *   Whether or not the component is a layout component.
 */
export function isLayoutComponent(component: Component) {
  return Boolean(
    ((component as ColumnsComponent).columns &&
      Array.isArray((component as ColumnsComponent).columns)) ||
      ((component as TableComponent).rows && Array.isArray((component as TableComponent).rows)) ||
      ((component as HasChildComponents).components &&
        Array.isArray((component as HasChildComponents).components)),
  );
}

/**
 * Matches if a component matches the query.
 *
 * @param component
 * @param query
 * @return {boolean}
 */
export function matchComponent(component: Component, query: any) {
  if (isString(query)) {
    return component.key === query || component.path === query;
  } else {
    let matches = false;
    forOwn(query, (value, key) => {
      matches = get(component, key) === value;
      if (!matches) {
        return false;
      }
    });
    return matches;
  }
}

/**
 * Get a component by its key
 *
 * @param {Object} components - The components to iterate.
 * @param {String|Object} key - The key of the component to get, or a query of the component to search.
 * @param {boolean} includeAll - Whether or not to include layout components.
 * @returns {Component} - The component that matches the given key, or undefined if not found.
 */
export function getComponent(
  components: Component[],
  key: any,
  includeAll: any = false,
): Component | undefined {
  let result;
  eachComponent(
    components,
    (component: Component, path: any) => {
      if (path === key || component.path === key || (component.input && component.key === key)) {
        result = component;
        return true;
      }
    },
    includeAll,
  );
  return result;
}

/**
 * Finds a component provided a query of properties of that component.
 *
 * @param components
 * @param query
 * @return {*}
 */
export function searchComponents(components: Component[], query: any): Component[] {
  const results: Component[] = [];
  eachComponent(
    components,
    (component: any) => {
      if (matchComponent(component, query)) {
        results.push(component);
      }
    },
    true,
  );
  return results;
}

/**
 * Deprecated version of findComponents. Renamed to searchComponents.
 * @param {import('@formio/core').Component[]} components - The components to find components within.
 * @param {object} query - The query to use when searching for the components.
 * @returns {import('@formio/core').Component[]} - The result of the component that is found.
 */
export function findComponents(components: Component[], query: any): Component[] {
  console.warn('formio.js/utils findComponents is deprecated. Use searchComponents instead.');
  return searchComponents(components, query);
}

/**
 * Remove a component by path.
 *
 * @param components
 * @param path
 */
export function removeComponent(components: Component[], path: string) {
  // @ts-expect-error - I'm not sure why we're using `pop` here if it's a string
  const index = path.pop();
  if (path.length !== 0) {
    components = get(components, path);
  }
  components.splice(index, 1);
}

/**
 * Returns if this component has a conditional statement.
 *
 * @param component - The component JSON schema.
 *
 * @returns {boolean} - TRUE - This component has a conditional, FALSE - No conditional provided.
 */
export function hasCondition(component: Component) {
  return Boolean(
    component.customConditional ||
      (component.conditional &&
        ((component.conditional as LegacyConditional).when ||
          (component.conditional as JSONConditional).json ||
          ((component.conditional as SimpleConditional).conjunction &&
            isBoolean((component.conditional as SimpleConditional).show) &&
            !isEmpty((component.conditional as SimpleConditional).conditions)))),
  );
}

/**
 * Extension of standard #parseFloat(value) function, that also clears input string.
 *
 * @param {any} value
 *   The value to parse.
 *
 * @returns {Number}
 *   Parsed value.
 */
export function parseFloatExt(value: any) {
  return parseFloat(isString(value) ? value.replace(/[^\de.+-]/gi, '') : value);
}

/**
 * Formats provided value in way how Currency component uses it.
 *
 * @param {any} value
 *   The value to format.
 *
 * @returns {String}
 *   Value formatted for Currency component.
 */
export function formatAsCurrency(value: string) {
  const parsedValue = parseFloatExt(value);

  if (isNaN(parsedValue)) {
    return '';
  }

  const parts = round(parsedValue, 2).toString().split('.');
  parts[0] = chunk(Array.from(parts[0]).reverse(), 3)
    .reverse()
    .map((part) => part.reverse().join(''))
    .join(',');
  parts[1] = pad(parts[1], 2, '0');
  return parts.join('.');
}

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
 * Get the value for a component key, in the given submission.
 *
 * @param {Object} submission
 *   A submission object to search.
 * @param {String} key
 *   A for components API key to search for.
 */
export function getValue(submission: any, key: string) {
  const search = (data: any) => {
    if (isPlainObject(data)) {
      if (has(data, key)) {
        return get(data, key);
      }

      let value = null;

      forOwn(data, (prop) => {
        const result = search(prop);
        if (!isNil(result)) {
          value = result;
          return false;
        }
      });

      return value;
    } else {
      return null;
    }
  };

  return search(submission.data);
}

/**
 * Iterate over all components in a form and get string values for translation.
 * @param form
 */
export function getStrings(form: any) {
  const properties = [
    'label',
    'title',
    'legend',
    'tooltip',
    'description',
    'placeholder',
    'prefix',
    'suffix',
    'errorLabel',
    'content',
    'html',
  ];
  const strings: any = [];
  eachComponent(
    form.components,
    (component: any) => {
      properties.forEach((property) => {
        if (component.hasOwnProperty(property) && component[property]) {
          strings.push({
            key: component.key,
            type: component.type,
            property,
            string: component[property],
          });
        }
      });
      if (
        (!component.dataSrc || component.dataSrc === 'values') &&
        component.hasOwnProperty('values') &&
        Array.isArray(component.values) &&
        component.values.length
      ) {
        component.values.forEach((value: any, index: number) => {
          strings.push({
            key: component.key,
            property: `value[${index}].label`,
            string: component.values[index].label,
          });
        });
      }

      // Hard coded values from Day component
      if (component.type === 'day') {
        [
          'day',
          'month',
          'year',
          'Day',
          'Month',
          'Year',
          'january',
          'february',
          'march',
          'april',
          'may',
          'june',
          'july',
          'august',
          'september',
          'october',
          'november',
          'december',
        ].forEach((string) => {
          strings.push({
            key: component.key,
            property: 'day',
            string,
          });
        });

        if (component.fields.day.placeholder) {
          strings.push({
            key: component.key,
            property: 'fields.day.placeholder',
            string: component.fields.day.placeholder,
          });
        }

        if (component.fields.month.placeholder) {
          strings.push({
            key: component.key,
            property: 'fields.month.placeholder',
            string: component.fields.month.placeholder,
          });
        }

        if (component.fields.year.placeholder) {
          strings.push({
            key: component.key,
            property: 'fields.year.placeholder',
            string: component.fields.year.placeholder,
          });
        }
      }

      if (component.type === 'editgrid') {
        const string = component.addAnother || 'Add Another';
        if (component.addAnother) {
          strings.push({
            key: component.key,
            property: 'addAnother',
            string,
          });
        }
      }

      if (component.type === 'select') {
        ['loading...', 'Type to search'].forEach((string) => {
          strings.push({
            key: component.key,
            property: 'select',
            string,
          });
        });
      }
    },
    true,
  );

  return strings;
}

// ?????????????????????????
// questionable section

export function generateFormChange(type: any, data: any) {
  let change;
  switch (type) {
    case 'add':
      change = {
        op: 'add',
        key: data.component.key,
        container: data.parent.key, // Parent component
        path: data.path, // Path to container within parent component.
        index: data.index, // Index of component in parent container.
        component: data.component,
      };
      break;
    case 'edit':
      change = {
        op: 'edit',
        key: data.originalComponent.key,
        patches: compare(data.originalComponent, data.component),
      };

      // Don't save if nothing changed.
      if (!change.patches.length) {
        change = null;
      }
      break;
    case 'remove':
      change = {
        op: 'remove',
        key: data.component.key,
      };
      break;
  }

  return change;
}

export function applyFormChanges(form: any, changes: any) {
  const failed: any = [];
  changes.forEach(function (change: any) {
    let found = false;
    switch (change.op) {
      case 'add': {
        let newComponent = change.component;

        // Find the container to set the component in.
        findComponent(form.components, change.container, null, function (parent: any) {
          if (!change.container) {
            parent = form;
          }

          // A move will first run an add so remove any existing components with matching key before inserting.
          findComponent(form.components, change.key, null, function (component: any, path: any) {
            // If found, use the existing component. (If someone else edited it, the changes would be here)
            newComponent = component;
            removeComponent(form.components, path);
          });

          found = true;
          const container = get(parent, change.path);
          container.splice(change.index, 0, newComponent);
        });
        break;
      }
      case 'remove':
        findComponent(form.components, change.key, null, function (component: any, path: any) {
          found = true;
          const oldComponent = get(form.components, path);
          if (oldComponent.key !== component.key) {
            path.pop();
          }
          removeComponent(form.components, path);
        });
        break;
      case 'edit':
        findComponent(form.components, change.key, null, function (component: any, path: any) {
          found = true;
          try {
            const oldComponent = get(form.components, path);
            const newComponent = applyPatch(component, change.patches).newDocument;

            if (oldComponent.key !== newComponent.key) {
              path.pop();
            }

            set(form.components, path, newComponent);
          } catch (ignoreErr) {
            failed.push(change);
          }
        });
        break;
      case 'move':
        break;
    }
    if (!found) {
      failed.push(change);
    }
  });

  return {
    form,
    failed,
  };
}

/**
 * This function will find a component in a form and return the component AND THE PATH to the component in the form.
 * Path to the component is stored as an array of nested components and their indexes.The Path is being filled recursively
 * when you iterating through the nested structure.
 * If the component is not found the callback won't be called and function won't return anything.
 *
 * @param components
 * @param key
 * @param fn
 * @param path
 * @returns {*}
 */
export function findComponent(components: any, key: any, path: any, fn: any) {
  if (!components) return;
  path = path || [];

  if (!key) {
    return fn(components);
  }

  components.forEach(function (component: any, index: any) {
    const newPath = path.slice();
    // Add an index of the component it iterates through in nested structure
    newPath.push(index);
    if (!component) return;

    if (component.hasOwnProperty('columns') && Array.isArray(component.columns)) {
      newPath.push('columns');
      component.columns.forEach(function (column: any, index: any) {
        const colPath = newPath.slice();
        colPath.push(index);
        colPath.push('components');
        findComponent(column.components, key, colPath, fn);
      });
    }

    if (component.hasOwnProperty('rows') && Array.isArray(component.rows)) {
      newPath.push('rows');
      component.rows.forEach(function (row: any, index: any) {
        const rowPath = newPath.slice();
        rowPath.push(index);
        row.forEach(function (column: any, index: any) {
          const colPath = rowPath.slice();
          colPath.push(index);
          colPath.push('components');
          findComponent(column.components, key, colPath, fn);
        });
      });
    }

    if (component.hasOwnProperty('components') && Array.isArray(component.components)) {
      newPath.push('components');
      findComponent(component.components, key, newPath, fn);
    }

    if (component.key === key) {
      //Final callback if the component is found
      fn(component, newPath, components);
    }
  });
}

const isCheckboxComponent = (component: any): component is CheckboxComponent =>
  component?.type === 'checkbox';
const isDataGridComponent = (component: any): component is DataGridComponent =>
  component?.type === 'datagrid';
const isEditGridComponent = (component: any): component is EditGridComponent =>
  component?.type === 'editgrid';
const isAddressComponent = (component: any): component is AddressComponent =>
  component?.type === 'address';
const isDataTableComponent = (component: any): component is DataTableComponent =>
  component?.type === 'datatable';
const hasChildComponents = (component: any): component is HasChildComponents =>
  component?.components != null;
const isDateTimeComponent = (component: any): component is DateTimeComponent =>
  component?.type === 'datetime';
const isSelectBoxesComponent = (component: any): component is SelectBoxesComponent =>
  component?.type === 'selectboxes';
const isTextAreaComponent = (component: any): component is TextAreaComponent =>
  component?.type === 'textarea';
const isTextFieldComponent = (component: any): component is TextFieldComponent =>
  component?.type === 'textfield';

export function getEmptyValue(component: Component) {
  switch (component.type) {
    case 'textarea':
    case 'textfield':
    case 'time':
    case 'datetime':
    case 'day':
      return '';
    case 'datagrid':
    case 'editgrid':
      return [];

    default:
      return null;
  }
}

const replaceBlanks = (value: unknown) => {
  const nbsp = '<p>&nbsp;</p>';
  const br = '<p><br></p>';
  const brNbsp = '<p><br>&nbsp;</p>';
  const regExp = new RegExp(`^${nbsp}|${nbsp}$|^${br}|${br}$|^${brNbsp}|${brNbsp}$`, 'g');
  return typeof value === 'string' ? value.replace(regExp, '').trim() : value;
};

function trimBlanks(value: unknown) {
  if (!value) {
    return value;
  }

  if (Array.isArray(value)) {
    value = value.map((val: any) => replaceBlanks(val));
  } else {
    value = replaceBlanks(value);
  }
  return value;
}

function isValueEmpty(component: Component, value: any) {
  const compValueIsEmptyArray =
    isArray(value) && value.length === 1 ? isEqual(value[0], getEmptyValue(component)) : false;
  return (
    value == null || value === '' || (isArray(value) && value.length === 0) || compValueIsEmptyArray
  );
}

export function isComponentDataEmpty(
  component: Component,
  data: any,
  path: string,
  valueCond?: any,
): boolean {
  const value = isNil(valueCond) ? get(data, path) : valueCond;
  const addressIgnoreProperties = ['mode', 'address'];
  if (isCheckboxComponent(component)) {
    return isValueEmpty(component, value) || value === false;
  } else if (isAddressComponent(component)) {
    if (Object.keys(value).length === 0) {
      return true;
    }
    return !Object.values(omit(value, addressIgnoreProperties)).some(Boolean);
  } else if (
    isDataGridComponent(component) ||
    isEditGridComponent(component) ||
    isDataTableComponent(component) ||
    hasChildComponents(component)
  ) {
    if (component.components?.length) {
      let childrenEmpty = true;
      // wrap component in an array to let eachComponentData handle introspection to child components (e.g. this will be different
      // for data grids versus nested forms, etc.)
      eachComponentData([component], data, (thisComponent, data, row, path) => {
        if (component.key === thisComponent.key) return;
        if (!isComponentDataEmpty(thisComponent, data, path)) {
          childrenEmpty = false;
        }
      });
      return isValueEmpty(component, value) || childrenEmpty;
    }
    return isValueEmpty(component, value);
  } else if (isDateTimeComponent(component)) {
    return isValueEmpty(component, value) || value.toString() === 'Invalid date';
  } else if (isSelectBoxesComponent(component)) {
    let selectBoxEmpty = true;
    for (const key in value) {
      if (value[key]) {
        selectBoxEmpty = false;
        break;
      }
    }
    return isValueEmpty(component, value) || selectBoxEmpty;
  } else if (isTextAreaComponent(component)) {
    const isPlain = !component.wysiwyg && !component.editor;
    return isPlain
      ? typeof value === 'string'
        ? isValueEmpty(component, value.trim())
        : isValueEmpty(component, value)
      : isValueEmpty(component, trimBlanks(value));
  } else if (isTextFieldComponent(component)) {
    if (component.allowMultipleMasks && !!component.inputMasks && !!component.inputMasks.length) {
      return (
        isValueEmpty(component, value) ||
        (component.multiple ? value.length === 0 : !value.maskName || !value.value)
      );
    }
    return isValueEmpty(component, value?.toString().trim());
  }
  return isValueEmpty(component, value);
}

/**
 * Returns the template keys inside the template code.
 * @param {string} template - The template to get the keys from.
 * @returns {Array<string>} - The keys inside the template.
 */
export function getItemTemplateKeys(template: any) {
  const templateKeys: Array<string> = [];
  if (!template) {
    return templateKeys;
  }
  const keys = template.match(/({{\s*(.*?)\s*}})/g);

  if (keys) {
    keys.forEach((key: string) => {
      const propKey = key.match(/{{\s*item\.(.*?)\s*}}/);
      if (propKey && propKey.length > 1) {
        templateKeys.push(propKey[1]);
      }
    });
  }

  return templateKeys;
}

/**
 * Returns if the component is a select resource with an object for its value.
 * @param {Component} comp - The component to check.
 * @returns {boolean} - TRUE if the component is a select resource with an object for its value; FALSE otherwise.
 */
export function isSelectResourceWithObjectValue(comp: any = {}) {
  const { reference, dataSrc, valueProperty } = comp;
  return reference || (dataSrc === 'resource' && (!valueProperty || valueProperty === 'data'));
}

/**
 * Compares real select resource value with expected value in condition.
 * @param {any} value - current value of selectcomponent.
 * @param {any} comparedValue - expocted value of select component.
 * @param {SelectComponent} conditionComponent - select component on which the condtion is based.
 * @returns {boolean} - TRUE if the select component current value is equal to the expected value; FALSE otherwise.
 */
export function compareSelectResourceWithObjectTypeValues(
  value: any,
  comparedValue: any,
  conditionComponent: SelectComponent,
) {
  if (!value || !isPlainObject(value)) {
    return false;
  }

  const { template, valueProperty } = conditionComponent;

  if (valueProperty === 'data') {
    value = { data: value };
    comparedValue = { data: comparedValue };
  }

  return every(getItemTemplateKeys(template) || [], (k) =>
    isEqual(get(value, k), get(comparedValue, k)),
  );
}

export { eachComponent, eachComponentData, eachComponentAsync, eachComponentDataAsync };
