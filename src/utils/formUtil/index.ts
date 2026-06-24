import {
  last,
  get,
  set,
  isEmpty,
  isNil,
  has,
  isString,
  forOwn,
  round,
  chunk,
  pad,
  isPlainObject,
  isArray,
  isNumber,
  isEqual,
  isBoolean,
  omit,
  every,
  escapeRegExp,
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
  ComponentScope,
  ComponentPaths,
  ComponentPath,
  Form,
  ValidationContext,
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

  let modelType: keyof typeof MODEL_TYPES_OF_KNOWN_COMPONENTS = 'any';

  // Otherwise, check for known component types.
  for (const type of Object.keys(
    MODEL_TYPES_OF_KNOWN_COMPONENTS,
  ) as (keyof typeof MODEL_TYPES_OF_KNOWN_COMPONENTS)[]) {
    if (MODEL_TYPES_OF_KNOWN_COMPONENTS[type].includes(component.type)) {
      modelType = type;
      break;
    }
  }

  // Otherwise check for components that assert no value.
  if (
    modelType === 'any' &&
    (component.input === false ||
      ((component as HasChildComponents).components && !component.input))
  ) {
    modelType = 'none';
  }

  // To speed up performance of getModelType, we will set the modelType on the component
  Object.defineProperty(component, 'modelType', {
    enumerable: false,
    writable: true,
    value: modelType,
  });

  // Otherwise default to any.
  return modelType;
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

export function setComponentScope(
  component: Component,
  name: keyof NonNullable<ComponentScope>,
  value: string | boolean | number,
) {
  if (!component) {
    return;
  }
  if (!component.scope) {
    Object.defineProperty(component, 'scope', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: {},
    });
  }
  Object.defineProperty(component.scope, name, {
    enumerable: false,
    writable: false,
    configurable: true,
    value,
  });
}

export function resetComponentScope(component: Component) {
  if (component.scope) {
    delete component.scope;
  }
}

/**
 * Return the component path provided the type of the component path.
 * @param component - The component JSON.
 * @param type - The type of path to return.
 * @returns
 */
export function componentPath(
  component: Component,
  parent: Component | undefined | null,
  parentPaths: ComponentPaths | undefined | null,
  type: ComponentPath,
): string {
  if (!component) {
    return '';
  }
  if ((component as any).component) {
    component = (component as any).component;
  }
  const compModel = getModelType(component);

  // Relative paths are only referenced from the current form.
  const relative =
    type === ComponentPath.localPath ||
    type === ComponentPath.fullLocalPath ||
    type === ComponentPath.localDataPath ||
    type === ComponentPath.localContextualRowPath;

  // Full paths include all layout component ids in the path.
  const fullPath = type === ComponentPath.fullPath || type === ComponentPath.fullLocalPath;

  // See if this is a data path.
  const dataPath =
    type === ComponentPath.dataPath ||
    type === ComponentPath.localDataPath ||
    type === ComponentPath.contextualRowPath ||
    type === ComponentPath.localContextualRowPath;

  // Determine if this component should include its key.
  const includeKey =
    fullPath || (!!component.type && compModel !== 'none' && compModel !== 'content');

  // The key is provided if the component can have data or if we are fetching the full path.
  const key = includeKey ? getComponentKey(component) : '';

  // If this is a contextual row path.
  const contextual =
    type === ComponentPath.contextualRowPath || type === ComponentPath.localContextualRowPath;

  if (!parent) {
    // Return the key if there is no parent.
    return contextual ? '' : key;
  }

  // Get the parent model type.
  const parentModel = getModelType(parent);

  // If there is a parent, then we only return the key if the parent is a nested form and it is a relative path.
  if (relative && parentModel === 'dataObject') {
    return contextual ? '' : key;
  }

  // Return the parent path.
  const parentType = contextual
    ? relative
      ? ComponentPath.localDataPath
      : ComponentPath.dataPath
    : type;
  let parentPath = parentPaths?.hasOwnProperty(parentType) ? parentPaths[parentType] || '' : '';

  // For data paths (where we wish to get the path to the data), we need to ensure we append the parent
  // paths to the end of the path so that any component within this component properly references their data.
  if (dataPath && parentPath) {
    if (parentModel === 'nestedArray' || parentModel === 'nestedDataArray') {
      parentPath += `[${parentPaths?.dataIndex || 0}]`;
    }
    if (parentModel === 'dataObject' || parentModel === 'nestedDataArray') {
      parentPath += '.data';
    }
  }

  // If this is a contextual row path, then return here.
  if (contextual) {
    return parentPath;
  }

  // Return the parent path with its relative component path (if applicable).
  return parentPath ? (key ? `${parentPath}.${key}` : parentPath) : key;
}

/**
 * This method determines a components paths provided the component JSON, the parent and the parent paths.
 * @param component
 * @param parent
 * @param parentPaths
 * @returns
 */
export function getComponentPaths(
  component: Component,
  parent?: Component,
  parentPaths?: ComponentPaths,
): ComponentPaths {
  return {
    path: componentPath(component, parent, parentPaths, ComponentPath.path),
    fullPath: componentPath(component, parent, parentPaths, ComponentPath.fullPath),
    localPath: componentPath(component, parent, parentPaths, ComponentPath.localPath),
    fullLocalPath: componentPath(component, parent, parentPaths, ComponentPath.fullLocalPath),
    dataPath: componentPath(component, parent, parentPaths, ComponentPath.dataPath),
    localDataPath: componentPath(component, parent, parentPaths, ComponentPath.localDataPath),
    dataIndex: parentPaths?.dataIndex,
    contextualRowPath: componentPath(
      component,
      parent,
      parentPaths,
      ComponentPath.contextualRowPath,
    ),
    localContextualRowPath: componentPath(
      component,
      parent,
      parentPaths,
      ComponentPath.localContextualRowPath,
    ),
  };
}

export function getStringFromComponentPath(path: string | string[]) {
  if (!isArray(path)) {
    return path;
  }
  let strPath = '';
  path.forEach((part, i) => {
    if (isNumber(part)) {
      strPath += `[${part}]`;
    } else {
      strPath += i === 0 ? part : `.${part}`;
    }
  });
  return strPath;
}

export type ComponentMatch = {
  component: Component | undefined;
  paths: ComponentPaths | undefined;
};

/**
 * Determines if a component has a match at any of the path types.
 * @param component {Component} - The component JSON to check for matches.
 * @param paths {ComponentPaths} - The current component paths object.
 * @param path {string} - Either the "form" or "data" path to see if a match occurs.
 * @param dataIndex {number | undefined} - The data index for the current component to match.
 * @param matches {Record<string, ComponentMatch | undefined>} - The current matches object.
 * @param addMatch {(type: ComponentPath | 'key', match: ComponentMatch) => ComponentMatch} - A callback function to allow modules to decorate the match object.
 */
export function componentMatches(
  component: Component,
  paths: ComponentPaths,
  path: string,
  dataIndex?: number,
  matches: Record<string, ComponentMatch | undefined> = {
    path: undefined,
    fullPath: undefined,
    localPath: undefined,
    dataPath: undefined,
    localDataPath: undefined,
    fullLocalPath: undefined,
    key: undefined,
  },
  addMatch = (type: ComponentPath | 'key', match: ComponentMatch) => {
    return match;
  },
) {
  let dataProperty = '';
  if (component.type === 'selectboxes') {
    const valuePath = new RegExp(`(\\.${escapeRegExp(component.key)})(\\.[^\\.]+)$`);
    const pathMatches = path.match(valuePath);
    if (pathMatches?.length === 3) {
      dataProperty = pathMatches[2];
      path = path.replace(valuePath, '$1');
    }
  }

  // Get the current model type.
  const modelType = getModelType(component);
  const dataModel = modelType !== 'none' && modelType !== 'content';

  [
    ComponentPath.path,
    ComponentPath.fullPath,
    ComponentPath.localPath,
    ComponentPath.fullLocalPath,
    ComponentPath.dataPath,
    ComponentPath.localDataPath,
  ].forEach((type) => {
    const dataPath = type === ComponentPath.dataPath || type === ComponentPath.localDataPath;
    if (paths[type as ComponentPath] === path) {
      const currentMatch = matches[type as ComponentPath];
      const currentModelType = currentMatch?.component
        ? getModelType(currentMatch.component)
        : 'none';
      const currentDataModel = currentModelType !== 'none' && currentModelType !== 'content';
      if (
        !currentMatch ||
        (dataPath && dataModel && currentDataModel) || // Replace the current match if this is a dataPath and both are dataModels.
        (!dataPath && !isNil(paths.dataIndex) && dataIndex === paths.dataIndex) // Replace the current match if this is not a dataPath and the indexes are the same.
      ) {
        if (dataPath) {
          const dataPaths = {
            dataPath: paths.dataPath || '',
            localDataPath: paths.localDataPath || '',
          };
          if (dataProperty) {
            dataPaths.dataPath += dataProperty;
            dataPaths.localDataPath += dataProperty;
          }
          matches[type as ComponentPath] = addMatch(type, {
            component,
            paths: {
              ...paths,
              ...dataPaths,
            },
          });
        } else {
          matches[type as ComponentPath] = addMatch(type, { component, paths });
        }
      }
    }
  });
  if (!matches.key && component.key === path) {
    matches.key = addMatch('key', { component, paths });
  }
}

export function getBestMatch(
  matches: Record<string, ComponentMatch | undefined>,
): ComponentMatch | undefined {
  if (matches.dataPath) {
    return matches.dataPath;
  }
  if (matches.localDataPath) {
    return matches.localDataPath;
  }
  if (matches.fullPath) {
    return matches.fullPath;
  }
  if (matches.path) {
    return matches.path;
  }
  if (matches.fullLocalPath) {
    return matches.fullLocalPath;
  }
  if (matches.localPath) {
    return matches.localPath;
  }
  if (matches.key) {
    return matches.key;
  }
  return undefined;
}

/**
 * This method performs a fuzzy search for a component within a form provided a number of different
 * paths to search.
 */
export function getComponentFromPath(
  components: Component[],
  path: any,
  data?: any,
  dataIndex?: number,
  includeAll: any = false,
): ComponentMatch | undefined {
  const matches: Record<string, ComponentMatch | undefined> = {
    path: undefined,
    fullPath: undefined,
    localPath: undefined,
    fullLocalPath: undefined,
    dataPath: undefined,
    localDataPath: undefined,
    key: undefined,
  };
  if (data) {
    eachComponentData(
      components,
      data,
      (
        component: Component,
        data: DataObject,
        row: any,
        compPath: string,
        comps,
        index,
        parent,
        paths,
      ) => {
        componentMatches(component, paths || {}, path, dataIndex, matches);
      },
      includeAll,
      false,
      undefined,
      undefined,
      true,
    );
  } else {
    eachComponent(
      components,
      (component: Component, compPath: any, componentComponents, compParent, paths) => {
        componentMatches(component, paths || {}, path, dataIndex, matches);
      },
      includeAll,
    );
  }
  return getBestMatch(matches);
}

/**
 * Provided a component, this will return the "data" key for that component in the contextual data
 * object.
 *
 * @param component
 * @returns
 */
export function getComponentKey(component: Component) {
  if (!component) {
    return '';
  }
  if (
    component.type === 'checkbox' &&
    component.inputType === 'radio' &&
    (component as CheckboxComponent).name
  ) {
    return (component as CheckboxComponent).name;
  }
  return component.key;
}

export function getContextualRowData(
  component: Component,
  data: any,
  paths?: ComponentPaths,
  local?: boolean,
): any {
  if (
    paths?.hasOwnProperty('localContextualRowPath') &&
    paths?.hasOwnProperty('contextualRowPath')
  ) {
    const rowPath = local ? paths?.localContextualRowPath : paths?.contextualRowPath;
    return rowPath ? get(data, rowPath, null) : data;
  }
  // Fallback to the less performant regex method.
  const dataPath = local ? paths?.localDataPath : paths?.dataPath;
  const rowPath =
    dataPath?.replace(new RegExp(`.?${escapeRegExp(getComponentKey(component))}$`), '') || '';
  return rowPath ? get(data, rowPath, null) : data;
}

export function getComponentLocalData(paths: ComponentPaths, data: any, local?: boolean): string {
  if (local) {
    return data;
  }
  const parentPath =
    paths.dataPath?.replace(new RegExp(`.?${escapeRegExp(paths.localDataPath)}$`), '') || '';
  return parentPath ? get(data, parentPath, null) : data;
}

export function shouldProcessComponent(
  comp: Component,
  value: any,
  paths?: ComponentPaths,
): boolean {
  if (getModelType(comp) === 'dataObject') {
    const noReferenceAttached = value?._id ? isEmpty(value.data) && !has(value, 'form') : false;
    const shouldBeCleared =
      (!comp.hasOwnProperty('clearOnHide') || comp.clearOnHide) &&
      (comp.hidden || comp.scope?.conditionallyHidden);
    // Also skip processing if the value is empty and the form is in an array component.
    const emptyInDataGrid = !value && paths?.dataIndex !== undefined;
    const shouldSkipProcessingNestedFormData =
      noReferenceAttached || (shouldBeCleared && !comp.validateWhenHidden) || emptyInDataGrid;
    if (shouldSkipProcessingNestedFormData) {
      return false;
    }
  }
  return true;
}

export function componentInfo(component: any) {
  const hasColumns = component.columns && Array.isArray(component.columns);
  const hasRows = component.rows && Array.isArray(component.rows);
  const hasComps = component.components && Array.isArray(component.components);
  const isContent = getModelType(component) === 'content';
  const isLayout = getModelType(component) === 'none';
  const isInput =
    (!component.hasOwnProperty('input') && !component.components) || !!component.input;
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

export function getComponentValue(
  form: Form | undefined,
  data: DataObject,
  path: string,
  dataIndex?: number,
  local?: boolean,
) {
  const match: ComponentMatch | undefined = getComponentFromPath(
    form?.components || [],
    path,
    data,
    dataIndex,
  );
  if (!match) {
    // Fall back to get the value from the data object.
    return get(data, path, undefined);
  }
  if (local) {
    return match?.paths?.localDataPath ? get(data, match.paths.localDataPath, undefined) : null;
  }
  return match?.paths?.dataPath ? get(data, match.paths.dataPath, undefined) : null;
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
export function matchComponent(component: Component, query: any, paths?: ComponentPaths) {
  if (isString(query)) {
    return component.key === query || paths?.localPath === query || paths?.path === query;
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
 * Get a component by its path.
 *
 * @param {Object} components - The components to iterate.
 * @param {String|Object} path - The key of the component to get, or a query of the component to search.
 * @param {boolean} includeAll - Whether or not to include layout components.
 * @returns {Component} - The component that matches the given key, or undefined if not found.
 */
export function getComponent(
  components: Component[],
  path: any,
  includeAll: any = true,
  dataIndex?: number, // The preferred last data index of the component to find.
): Component | undefined {
  return getComponentFromPath(components, path, undefined, dataIndex, includeAll)?.component;
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
    (component: any, compPath, components, parent, compPaths) => {
      if (matchComponent(component, query, compPaths)) {
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
            (isBoolean((component.conditional as SimpleConditional).show) ||
              (component.conditional as SimpleConditional).show) &&
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

export function getComponentErrorField(component: Component, context: ValidationContext) {
  const toInterpolate =
    component.errorLabel || component.label || component.placeholder || component.key;
  return Evaluator.interpolate(toInterpolate, context);
}

/**
 * Normalize a context object so that it contains the correct paths and data, and so it can pass into and out of a sandbox for evaluation
 * @param context
 * @returns
 */
export function normalizeContext(context: any): any {
  const {
    data,
    paths,
    local,
    path,
    form,
    submission,
    row,
    component,
    instance,
    value,
    options,
    scope,
    config,
  } = context;

  const { database, ...safeConfig } = config || {};
  return {
    path: paths ? paths.localDataPath : path,
    data: paths ? getComponentLocalData(paths, data, local) : data,
    paths,
    form,
    scope,
    submission,
    row,
    component,
    instance,
    value,
    input: value,
    config: safeConfig,
    options,
  };
}

export { eachComponent, eachComponentData, eachComponentAsync, eachComponentDataAsync };
