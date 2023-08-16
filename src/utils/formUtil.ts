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

// Async each component data.
export const eachComponentDataAsync = async (
  components: Component[],
  data: DataObject,
  row: any,
  fn: AsyncComponentDataCallback,
  path = "",
  index?: number
) => {
  if (!components || !data) {
    return;
  }
  row = row || data;
  return await eachComponentAsync(
    components,
    async (component: any, compPath: string, componentComponents: any) => {
      if (await fn(component, data, row, compPath, componentComponents, index) === true) {
        return true;
      }
      if (TREE_COMPONENTS.includes(component.type) || component.tree) {
        row = get(data, compPath, data);
        if (Array.isArray(row)) {
          for (let i = 0; i < row.length; i++) {
            await eachComponentDataAsync(
              component.components,
              data,
              row[i],
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
        await eachComponentDataAsync(component.components, data, row, fn, compPath);
        return true;
      } else {
        return false;
      }
    },
    true,
    path
  );
};

const TREE_COMPONENTS = [
  "datagrid",
  "editgrid",
  "container",
  "form",
  "dynamicWizard",
];

export const eachComponentData = (
  components: Component[],
  data: DataObject,
  row: any,
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
      row = row || data;
      if (fn(component, data, row, compPath, componentComponents, index) === true) {
        return true;
      }
      if (TREE_COMPONENTS.includes(component.type) || component.tree) {
        row = get(data, compPath, data);
        if (Array.isArray(row)) {
          for (let i = 0; i < row.length; i++) {
            eachComponentData(component.components, data, row[i], fn, `${compPath}[${i}]`, i);
          }
          return true;
        } else if (isEmpty(row)) {
          // Tree components may submit empty objects; since we've already evaluated the parent tree/layout component, we won't worry about constituent elements
          return true;
        }
        eachComponentData(component.components, data, row, fn, compPath, index);
        return true;
      } else {
        return false;
      }
    },
    true,
    path
  );
};

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
    const hasColumns = component.columns && Array.isArray(component.columns);
    const hasRows = component.rows && Array.isArray(component.rows);
    const hasComps =
      component.components && Array.isArray(component.components);
    let noRecurse = false;
    const compPath = component.parentPath || path;
    const newPath = component.key
      ? compPath
        ? `${compPath}.${component.key}`
        : component.key
      : "";

    // Keep track of parent references.
    if (parent) {
      // Ensure we don't create infinite JSON structures.
      component.parent = { ...parent };
      delete component.parent.components;
      delete component.parent.componentMap;
      delete component.parent.columns;
      delete component.parent.rows;
    }

    // there's no need to add other layout components here because we expect that those would either have columns, rows or components
    const layoutTypes = ["htmlelement", "content"];
    const isLayoutComponent =
      hasColumns ||
      hasRows ||
      hasComps ||
      layoutTypes.indexOf(component.type) > -1;
    if (includeAll || component.tree || !isLayoutComponent) {
      noRecurse = fn(component, newPath, components);
    }

    const subPath = () => {
      if (
        component.key &&
        ![
          "panel",
          "table",
          "well",
          "columns",
          "fieldset",
          "tabs",
          "form",
        ].includes(component.type) &&
        ([
          "datagrid",
          "container",
          "editgrid",
          "address",
          "dynamicWizard",
        ].includes(component.type) ||
          component.tree)
      ) {
        return newPath;
      } else if (component.key && component.type === "form") {
        return `${newPath}.data`;
      }
      return compPath;
    };

    if (!noRecurse) {
      if (hasColumns) {
        component.columns.forEach((column: any) =>
          eachComponent(
            column.components,
            fn,
            includeAll,
            subPath(),
            parent ? component : null
          )
        );
      } else if (hasRows) {
        component.rows.forEach((row: any) => {
          if (Array.isArray(row)) {
            row.forEach((column) =>
              eachComponent(
                column.components,
                fn,
                includeAll,
                subPath(),
                parent ? component : null
              )
            );
          }
        });
      } else if (hasComps) {
        eachComponent(
          component.components,
          fn,
          includeAll,
          subPath(),
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
    const hasColumns = component.columns && Array.isArray(component.columns);
    const hasRows = component.rows && Array.isArray(component.rows);
    const hasComps =
      component.components && Array.isArray(component.components);
    const compPath = component.parentPath || path;
    const newPath = component.key
      ? compPath
        ? `${compPath}.${component.key}`
        : component.key
      : compPath;
    const layoutTypes = ["htmlelement", "content"];
    const isLayoutComponent =
      hasColumns ||
      hasRows ||
      hasComps ||
      layoutTypes.indexOf(component.type) > -1;
    if (includeAll || component.tree || !isLayoutComponent) {
      if (await fn(component, components, newPath)) {
        continue;
      }
    }
    if (hasColumns) {
      for (let j = 0; j < component.columns.length; j++) {
        await eachComponentAsync(
          component.columns[j]?.components,
          fn,
          includeAll,
          compPath
        );
      }
    } else if (hasRows) {
      for (let j = 0; j < component.rows.length; j++) {
        let row = component.rows[j];
        if (Array.isArray(row)) {
          for (let k = 0; k < row.length; k++) {
            await eachComponentAsync(row[k]?.components, fn, includeAll, compPath);
          }
        }
      }
    } else if (hasComps) {
      const subPath = isLayoutComponent
        ? compPath
        : component.type === "form"
        ? `${newPath}.data`
        : newPath;
      await eachComponentAsync(component.components, fn, includeAll, subPath);
    }
  }
}
