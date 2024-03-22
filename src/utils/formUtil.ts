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
  isEqual
} from "lodash";
import { compare, applyPatch } from 'fast-json-patch';
import {
  AsyncComponentDataCallback,
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
  ComponentDataCallback,
  DataObject,
} from "types";
import { Evaluator } from "./Evaluator";

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
export function flattenComponents(components: Component[], includeAll: boolean) {
  const flattened: any = {};
  eachComponent(
    components,
    (component: any, path: string) => {
      flattened[path] = component;
    },
    includeAll
  );
  return flattened;
}

export function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
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
  template = template || "{{fileName}}-{{guid}}";
  //include guid in template anyway, to prevent overwriting issue if filename matches existing file
  if (!template.includes("{{guid}}")) {
    template = `${template}-{{guid}}`;
  }
  const parts = name.split(".");
  let fileName = parts.slice(0, parts.length - 1).join(".");
  const extension = parts.length > 1 ? `.${last(parts)}` : "";
  //allow only 100 characters from original name to avoid issues with filename length restrictions
  fileName = fileName.substr(0, 100);
  evalContext = Object.assign(evalContext || {}, {
    fileName,
    guid: guid(),
  });
  //only letters, numbers, dots, dashes, underscores and spaces are allowed. Anything else will be replaced with dash
  const uniqueName = `${Evaluator.interpolate(
    template,
    evalContext
  )}${extension}`.replace(/[^0-9a-zA-Z.\-_ ]/g, "-");
  return uniqueName;
}

export const MODEL_TYPES: Record<string, string[]> = {
  array: [
    'datagrid',
    'editgrid',
    'datatable',
    'dynamicWizard',
  ],
  dataObject: [
    'form'
  ],
  object: [
    'container',
    'address'
  ],
  map: [
    'datamap'
  ],
  content: [
    'htmlelement',
    'content'
  ],
  layout: [
    'table',
    'tabs',
    'well',
    'columns',
    'fieldset',
    'panel',
    'tabs'
  ],
};

export function getModelType(component: Component) {
  if (isComponentNestedDataType(component)) {
    if (isComponentModelType(component, 'dataObject')) {
      return 'dataObject';
    }
    if (isComponentModelType(component, 'array')) {
      return 'array';
    }
    return 'object';
  }
  if ((component.input === false) || isComponentModelType(component, 'layout')) {
    return 'inherit';
  }
  if (getComponentKey(component)) {
    return 'value';
  }
  return 'inherit';
}

export function getComponentAbsolutePath(component: Component) {
  let paths = [component.path];
  while (component.parent) {
    component = component.parent;
    // We only need to do this for nested forms because they reset the data contexts for the children.
    if (isComponentModelType(component, 'dataObject')) {
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
  return (getModelType(component) === 'inherit') ? `${path}.${key}` : path;
}

export function isComponentModelType(component: Component, modelType: string) {
  return component.modelType === modelType || MODEL_TYPES[modelType].includes(component.type);
}

export function isComponentNestedDataType(component: any) {
  return component.tree || isComponentModelType(component, 'array') ||
    isComponentModelType(component, 'dataObject') ||
    isComponentModelType(component, 'object') ||
    isComponentModelType(component, 'map');
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

export const componentChildPath = (component: any, parentPath?: string, path?: string): string => {
  parentPath = component.parentPath || parentPath;
  path = path || componentPath(component, parentPath);
  // See if we are a nested component.
  if (component.components && Array.isArray(component.components)) {
    if (isComponentModelType(component, 'dataObject')) {
      return `${path}.data`;
    }
    if (isComponentNestedDataType(component)) {
      return path;
    }
    return parentPath === undefined ? path : parentPath;
  }
  return path;
}

// Async each component data.
export const eachComponentDataAsync = async (
  components: Component[],
  data: DataObject,
  fn: AsyncComponentDataCallback,
  path = "",
  index?: number,
  parent?: Component
) => {
  if (!components || !data) {
    return;
  }
  return await eachComponentAsync(
    components,
    async (component: any, compPath: string, componentComponents: any, compParent: any) => {
      const row = getContextualRowData(component, compPath, data);
      if (await fn(component, data, row, compPath, componentComponents, index, compParent) === true) {
        return true;
      }
      if (isComponentNestedDataType(component)) {
        const value = get(data, compPath, data);
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            await eachComponentDataAsync(
              component.components,
              data,
              fn,
              `${compPath}[${i}]`,
              i,
              component
            );
          }
          return true;
        } else if (isEmpty(row)) {
          // Tree components may submit empty objects; since we've already evaluated the parent tree/layout component, we won't worry about constituent elements
          return true;
        }
        if (isComponentModelType(component, 'dataObject')) {
          // No need to bother processing all the children data if there is no data for this form.
          if (has(data, component.path)) {
            // For nested forms, we need to reset the "data" and "path" objects for all of the children components, and then re-establish the data when it is done.
            const childPath: string = componentChildPath(component, path, compPath);
            const childData: any = get(data, childPath, null);
            await eachComponentDataAsync(component.components, childData, fn, '', index, component);
            set(data, childPath, childData);
          }
        }
        else {
          await eachComponentDataAsync(component.components, data, fn, componentChildPath(component, path, compPath), index, component);
        }
        return true;
      } else {
        return false;
      }
    },
    true,
    path,
    parent
  );
};

export const eachComponentData = (
  components: Component[],
  data: DataObject,
  fn: ComponentDataCallback,
  path = "",
  index?: number,
  parent?: Component
) => {
  if (!components || !data) {
    return;
  }
  return eachComponent(
    components,
    (component: any, compPath: string, componentComponents: any, compParent: any) => {
      const row = getContextualRowData(component, compPath, data);
      if (fn(component, data, row, compPath, componentComponents, index, compParent) === true) {
        return true;
      }
      if (isComponentNestedDataType(component)) {
        const value = get(data, compPath, data) as DataObject;
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            eachComponentData(component.components, data, fn, `${compPath}[${i}]`, i, component);
          }
          return true;
        } else if (isEmpty(row)) {
          // Tree components may submit empty objects; since we've already evaluated the parent tree/layout component, we won't worry about constituent elements
          return true;
        }
        if (isComponentModelType(component, 'dataObject')) {
          // No need to bother processing all the children data if there is no data for this form.
          if (has(data, component.path)) {
            // For nested forms, we need to reset the "data" and "path" objects for all of the children components, and then re-establish the data when it is done.
            const childPath: string = componentChildPath(component, path, compPath);
            const childData: any = get(data, childPath, {});
            eachComponentData(component.components, childData, fn, '', index, component);
            set(data, childPath, childData);
          }
        }
        else {
          eachComponentData(component.components, data, fn, componentChildPath(component, path, compPath), index, component);
        }
        return true;
      } else {
        return false;
      }
    },
    true,
    path,
    parent
  );
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
  return path.replace(new RegExp(`\.?${getComponentKey(component)}$`), '');
}


export function getContextualRowData(component: Component, path: string, data: any): any {
  const rowPath = getContextualRowPath(component, path);
  return rowPath ? get(data, rowPath, null) : data;
}

export function componentInfo(component: any) {
  const hasColumns = component.columns && Array.isArray(component.columns);
  const hasRows = component.rows && Array.isArray(component.rows);
  const hasComps = component.components && Array.isArray(component.components);
  return {
    hasColumns,
    hasRows,
    hasComps,
    iterable: hasColumns || hasRows || hasComps || isComponentModelType(component, 'content'),
  }
}

/**
 * Iterate through each component within a form.
 *
 * @param {Object} components
 *   The components to iterate.
 * @param {Function} fn
 *   The iteration function to invoke for each component.
 * @param {Boolean} includeAll
 *   Whether or not to include layout components.
 * @param {String} path
 *   The current data path of the element. Example: data.user.firstName
 * @param {Object} parent
 *   The parent object.
 */
export function eachComponent(
  components: any,
  fn: any,
  includeAll?: boolean,
  path?: string,
  parent?: any
) {
  if (!components) return;
  path = path || "";
  components.forEach((component: any) => {
    if (!component) {
      return;
    }
    const info = componentInfo(component);
    let noRecurse = false;
    // Keep track of parent references.
    if (parent) {
      // Ensure we don't create infinite JSON structures.
      Object.defineProperty(component, 'parent', {
        enumerable: false,
        writable: true,
        value: JSON.parse(JSON.stringify(parent))
      });
      Object.defineProperty(component.parent, 'parent', {
        enumerable: false,
        writable: true,
        value: parent.parent
      });
      Object.defineProperty(component.parent, 'path', {
        enumerable: false,
        writable: true,
        value: parent.path
      });
      delete component.parent.components;
      delete component.parent.componentMap;
      delete component.parent.columns;
      delete component.parent.rows;
    }

    Object.defineProperty(component, 'path', {
      enumerable: false,
      writable: true,
      value: componentPath(component, path)
    });

    if (includeAll || component.tree || !info.iterable) {
      noRecurse = fn(component, component.path, components, parent);
    }

    if (!noRecurse) {
      if (info.hasColumns) {
        component.columns.forEach((column: any) =>
          eachComponent(
            column.components,
            fn,
            includeAll,
            path,
            parent ? component : null
          )
        );
      } else if (info.hasRows) {
        component.rows.forEach((row: any) => {
          if (Array.isArray(row)) {
            row.forEach((column) =>
              eachComponent(
                column.components,
                fn,
                includeAll,
                path,
                parent ? component : null
              )
            );
          }
        });
      } else if (info.hasComps) {
        eachComponent(
          component.components,
          fn,
          includeAll,
          componentChildPath(component, path),
          parent ? component : null
        );
      }
    }
  });
}

// Async each component.
export async function eachComponentAsync(
  components: any[],
  fn: any,
  includeAll = false,
  path = "",
  parent?: any
) {
  if (!components) return;
  for (let i = 0; i < components.length; i++) {
    if (!components[i]) {
      continue;
    }
    let component = components[i];
    const info = componentInfo(component);
    // Keep track of parent references.
    if (parent) {
      // Ensure we don't create infinite JSON structures.
      Object.defineProperty(component, 'parent', {
        enumerable: false,
        writable: true,
        value: JSON.parse(JSON.stringify(parent))
      });
      Object.defineProperty(component.parent, 'parent', {
        enumerable: false,
        writable: true,
        value: parent.parent
      });
      Object.defineProperty(component.parent, 'path', {
        enumerable: false,
        writable: true,
        value: parent.path
      });
      delete component.parent.components;
      delete component.parent.componentMap;
      delete component.parent.columns;
      delete component.parent.rows;
    }
    Object.defineProperty(component, 'path', {
      enumerable: false,
      writable: true,
      value: componentPath(component, path)
    });
    if (includeAll || component.tree || !info.iterable) {
      if (await fn(component, component.path, components, parent)) {
        continue;
      }
    }
    if (info.hasColumns) {
      for (let j = 0; j < component.columns.length; j++) {
        await eachComponentAsync(
          component.columns[j]?.components,
          fn,
          includeAll,
          path,
          parent ? component : null
        );
      }
    } else if (info.hasRows) {
      for (let j = 0; j < component.rows.length; j++) {
        let row = component.rows[j];
        if (Array.isArray(row)) {
          for (let k = 0; k < row.length; k++) {
            await eachComponentAsync(
              row[k]?.components,
              fn, includeAll,
              path,
              parent ? component : null
            );
          }
        }
      }
    } else if (info.hasComps) {
      await eachComponentAsync(
        component.components,
        fn,
        includeAll,
        componentChildPath(component, path),
        parent ? component : null
      );
    }
  }
}

// Provided components, data, and a key, this will return the components data.
export function getComponentData(components: Component[], data: DataObject, path: string) {
  const compData: any = { component: null, data: null };
  eachComponentData(components, data, (component: Component, data: DataObject, row: any, compPath: string) => {
    if (compPath === path) {
      compData.component = component;
      compData.data = row;
      return true;
    }
  });
  return compData;
}

export function getComponentActualValue(compPath: string, data: any, row: any) {
  let value = null;
  if (row) {
      value = get(row, compPath);
  }
  if (data && isNil(value)) {
      value = get(data, compPath);
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
export function isLayoutComponent(component: any) {
  return Boolean(
    (component.columns && Array.isArray(component.columns)) ||
    (component.rows && Array.isArray(component.rows)) ||
    (component.components && Array.isArray(component.components))
  );
}

/**
 * Matches if a component matches the query.
 *
 * @param component
 * @param query
 * @return {boolean}
 */
export function matchComponent(component: any, query: any) {
  if (isString(query)) {
    return (component.key === query) || (component.path === query);
  }
  else {
    let matches = false;
    forOwn(query, (value, key) => {
      matches = (get(component, key) === value);
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
 * @param {Object} components
 *   The components to iterate.
 * @param {String|Object} key
 *   The key of the component to get, or a query of the component to search.
 *
 * @returns {Object}
 *   The component that matches the given key, or undefined if not found.
 */
export function getComponent(components: any, key: any, includeAll: any) {
  let result;
  eachComponent(components, (component: any, path: any) => {
    if ((path === key) || (component.path === key)) {
      result = component;
      return true;
    }
  }, includeAll);
  return result;
}

/**
 * Finds a component provided a query of properties of that component.
 *
 * @param components
 * @param query
 * @return {*}
 */
export function searchComponents(components: any, query: any) {
  const results: any[] = [];
  eachComponent(components, (component: any) => {
    if (matchComponent(component, query)) {
      results.push(component);
    }
  }, true);
  return results;
}


/**
 * Remove a component by path.
 *
 * @param components
 * @param path
 */
export function removeComponent(components: any, path: string) {
  // Using _.unset() leave a null value. Use Array splice instead.
  // @ts-ignore
  var index = path.pop();
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
export function hasCondition(component: any) {
  return Boolean(
    (component.customConditional) ||
    (component.conditional && (
      component.conditional.when ||
      component.conditional.json ||
      component.conditional.condition
    ))
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
  return parseFloat(isString(value)
    ? value.replace(/[^\de.+-]/gi, '')
    : value);
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

  const parts = round(parsedValue, 2)
    .toString()
    .split('.');
  parts[0] = chunk(Array.from(parts[0]).reverse(), 3)
    .reverse()
    .map((part) => part
      .reverse()
      .join(''))
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
    }
    else {
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
  const properties = ['label', 'title', 'legend', 'tooltip', 'description', 'placeholder', 'prefix', 'suffix', 'errorLabel', 'content', 'html'];
  const strings: any = [];
  eachComponent(form.components, (component: any) => {
    properties.forEach(property => {
      if (component.hasOwnProperty(property) && component[property]) {
        strings.push({
          key: component.key,
          type: component.type,
          property,
          string: component[property]
        });
      }
    });
    if ((!component.dataSrc || component.dataSrc === 'values') && component.hasOwnProperty('values') && Array.isArray(component.values) && component.values.length) {
      component.values.forEach((value: any, index: number) => {
        strings.push({
          key: component.key,
          property: `value[${index}].label`,
          string: component.values[index].label
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
        'december'
      ].forEach(string => {
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
      [
        'loading...',
        'Type to search'
      ].forEach(string => {
        strings.push({
          key: component.key,
          property: 'select',
          string,
        });
      });
    }
  }, true);

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
        component: data.component
      };
      break;
    case 'edit':
      change = {
        op: 'edit',
        key: data.originalComponent.key,
        patches: compare(data.originalComponent, data.component)
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
  changes.forEach(function(change: any) {
    var found = false;
    switch (change.op) {
      case 'add':
        var newComponent = change.component;

        // Find the container to set the component in.
        findComponent(form.components, change.container, null, function(parent: any) {
          if (!change.container) {
            parent = form;
          }

          // A move will first run an add so remove any existing components with matching key before inserting.
          findComponent(form.components, change.key, null, function(component: any, path: any) {
            // If found, use the existing component. (If someone else edited it, the changes would be here)
            newComponent = component;
            removeComponent(form.components, path);
          });

          found = true;
          var container = get(parent, change.path);
          container.splice(change.index, 0, newComponent);
        });
        break;
      case 'remove':
        findComponent(form.components, change.key, null, function(component: any, path: any) {
          found = true;
          const oldComponent = get(form.components, path);
          if (oldComponent.key !== component.key) {
            path.pop();
          }
          removeComponent(form.components, path);
        });
        break;
      case 'edit':
        findComponent(form.components, change.key, null, function(component: any, path: any) {
          found = true;
          try {
            const oldComponent = get(form.components, path);
            const newComponent = applyPatch(component, change.patches).newDocument;

            if (oldComponent.key !== newComponent.key) {
              path.pop();
            }

            set(form.components, path, newComponent);
          }
          catch (err) {
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
    failed
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

  components.forEach(function(component: any, index: any) {
    var newPath = path.slice();
    // Add an index of the component it iterates through in nested structure
    newPath.push(index);
    if (!component) return;

    if (component.hasOwnProperty('columns') && Array.isArray(component.columns)) {
      newPath.push('columns');
      component.columns.forEach(function(column: any, index: any) {
        var colPath = newPath.slice();
        colPath.push(index);
        colPath.push('components');
        findComponent(column.components, key, colPath, fn);
      });
    }

    if (component.hasOwnProperty('rows') && Array.isArray(component.rows)) {
      newPath.push('rows');
      component.rows.forEach(function(row: any, index: any) {
        var rowPath = newPath.slice();
        rowPath.push(index);
        row.forEach(function(column: any, index: any) {
          var colPath = rowPath.slice();
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

const isCheckboxComponent = (component: Component): component is CheckboxComponent => component.type === 'checkbox';
const isDataGridComponent = (component: Component): component is DataGridComponent => component.type === 'datagrid';
const isEditGridComponent = (component: Component): component is EditGridComponent => component.type === 'editgrid';
const isDataTableComponent = (component: Component): component is DataTableComponent => component.type === 'datatable';
const hasChildComponents = (component: any): component is HasChildComponents => component.components != null;
const isDateTimeComponent = (component: Component): component is DateTimeComponent => component.type === 'datetime';
const isSelectBoxesComponent = (component: Component): component is SelectBoxesComponent => component.type === 'selectboxes';
const isTextAreaComponent = (component: Component): component is TextAreaComponent => component.type === 'textarea';
const isTextFieldComponent = (component: Component): component is TextFieldComponent => component.type === 'textfield';

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
  return typeof value === 'string' ? value.replace(regExp, '') : value;
};

function trimBlanks(value: unknown) {
    if (!value) {
      return value;
    }

    if (Array.isArray(value)) {
      value = value.map((val: any) => replaceBlanks(val));
    }
    else {
      value = replaceBlanks(value);
    }
    return value;
  }

export function isComponentDataEmpty(component: Component, data: any, path: string, value?: any): boolean {
    const thisValue = value || get(data, path);
    const compValueIsEmptyArray = (isArray(value) && value.length === 1) ? isEqual(value[0], getEmptyValue(component)) : false;
    const compValueIsEmpty = value == null || (isArray(value) && value.length === 0) || compValueIsEmptyArray;
    if (isCheckboxComponent(component)) {
        return compValueIsEmpty || value === false;
    } else if (isDataGridComponent(component) || isEditGridComponent(component) || isDataTableComponent(component) || hasChildComponents(component)) {
        if (component.components?.length) {
            let childrenEmpty = false;
            eachComponentData(component.components, data, (component, data, row, path) => {
                if (isComponentDataEmpty(component, data, path)) {
                    childrenEmpty = true;
                }
            });
            return compValueIsEmpty || childrenEmpty;
        }
        return compValueIsEmpty;
    } else if (isDateTimeComponent(component)) {
        return compValueIsEmpty || value.toString() === 'Invalid date';
    } else if (isSelectBoxesComponent(component)) {
        let selectBoxEmpty = true;
        for (const key in value) {
            if (value[key]) {
                selectBoxEmpty = false;
                break;
            }
        }
        return compValueIsEmpty || selectBoxEmpty;
    } else if (isTextAreaComponent(component)) {
        const isPlain = !component.wysiwyg && !component.editor;
        return isPlain ? compValueIsEmpty : trimBlanks(value) === '';
    } else if (isTextFieldComponent(component)) {
        if (component.allowMultipleMasks && !!component.inputMasks && !!component.inputMasks.length) {
            return compValueIsEmpty || value?.toString().trim();
        }
        return compValueIsEmpty || (component.multiple ? value.length === 0 : (!value.maskName || !value.value));
    }
    return compValueIsEmpty;
}
