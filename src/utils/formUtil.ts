import { last, get, isEmpty } from "lodash";

import {
  AsyncComponentDataCallback,
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
export function flattenComponents(components: any, includeAll: boolean) {
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

export function getModelType(component: any) {
  if (isComponentNestedDataType(component)) {
    if (isComponentModelType(component, 'dataObject')) {
      return 'dataObject';
    }
    if (isComponentModelType(component, 'array')) {
      return 'array';
    }
    return 'object';
  }
  if (component.key) {
    return 'value';
  }
  return 'inherit';
}

export function isComponentModelType(component: any, modelType: string) {
  return component.modelType === modelType || MODEL_TYPES[modelType].includes(component.type);
}

export function isComponentNestedDataType(component: any) {
  return component.tree || isComponentModelType(component, 'array') || 
    isComponentModelType(component, 'dataObject') ||
    isComponentModelType(component, 'object') || 
    isComponentModelType(component, 'map');
}

export function componentDataPath(component: any, parentPath?: string) {
  parentPath = component.parentPath || parentPath;
  if (!component.key) {
    // If the component does not have a key, then just always return the parent path.
    return parentPath;
  }
  
  // Calculate the new component data path.
  const newPath = parentPath ? `${parentPath}.${component.key}` : component.key;

  // See if we are a nested component.
  if (component.components && Array.isArray(component.components)) {
    if (isComponentModelType(component, 'dataObject')) {
      return `${newPath}.data`;
    }
    if (isComponentNestedDataType(component)) {
      return newPath;
    }
    return parentPath;
  }

  // We are not a nested component, but have a key, then we are a value component.
  return newPath;
}

// Async each component data.
export const eachComponentDataAsync = async (
  components: Component[],
  data: DataObject,
  fn: AsyncComponentDataCallback,
  path = "",
  index?: number
) => {
  if (!components || !data) {
    return;
  }
  return await eachComponentAsync(
    components,
    async (component: any, componentComponents: any, compPath: string) => {
      const row = getContextualRowData(compPath, data);
      if (await fn(component, data, row, compPath, componentComponents, index) === true) {
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
              i
            );
          }
          return true;
        } else if (isEmpty(row)) {
          // Tree components may submit empty objects; since we've already evaluated the parent tree/layout component, we won't worry about constituent elements
          return true;
        }
        await eachComponentDataAsync(component.components, data, fn, compPath);
        return true;
      } else {
        return false;
      }
    },
    true,
    path
  );
};

export const eachComponentData = (
  components: Component[],
  data: DataObject,
  fn: ComponentDataCallback,
  path = "",
  index?: number
) => {
  if (!components || !data) {
    return;
  }
  return eachComponent(
    components,
    (component: any, compPath: string, componentComponents: any) => {
      const row = getContextualRowData(compPath, data);
      if (fn(component, data, row, compPath, componentComponents, index) === true) {
        return true;
      }
      if (isComponentNestedDataType(component)) {
        const value = get(data, compPath, data);
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            eachComponentData(component.components, data, fn, `${compPath}[${i}]`, i);
          }
          return true;
        } else if (isEmpty(row)) {
          // Tree components may submit empty objects; since we've already evaluated the parent tree/layout component, we won't worry about constituent elements
          return true;
        }
        eachComponentData(component.components, data, fn, compPath, index);
        return true;
      } else {
        return false;
      }
    },
    true,
    path
  );
};

export function getContextualRowPath(path: string): string {
  const lastDotIndex = path.lastIndexOf('.');
  return lastDotIndex === -1 ? '' : path.substring(0, lastDotIndex);
}


export function getContextualRowData(path: string, data: any): any {
  const rowPath = getContextualRowPath(path);
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
      component.parent = { ...parent };
      delete component.parent.components;
      delete component.parent.componentMap;
      delete component.parent.columns;
      delete component.parent.rows;
    }
    if (includeAll || component.tree || !info.iterable) {
      noRecurse = fn(component, componentDataPath(component, path), components);
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
          componentDataPath(component, path),
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
  path = ""
) {
  if (!components) return;
  for (let i = 0; i < components.length; i++) {
    if (!components[i]) {
      continue;
    }
    let component = components[i];
    const info = componentInfo(component);
    if (includeAll || component.tree || !info.iterable) {
      if (await fn(component, components, componentDataPath(component, path))) {
        continue;
      }
    }
    if (info.hasColumns) {
      for (let j = 0; j < component.columns.length; j++) {
        await eachComponentAsync(
          component.columns[j]?.components,
          fn,
          includeAll,
          path
        );
      }
    } else if (info.hasRows) {
      for (let j = 0; j < component.rows.length; j++) {
        let row = component.rows[j];
        if (Array.isArray(row)) {
          for (let k = 0; k < row.length; k++) {
            await eachComponentAsync(row[k]?.components, fn, includeAll, path);
          }
        }
      }
    } else if (info.hasComps) {
      await eachComponentAsync(component.components, fn, includeAll, componentDataPath(component, path));
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
