import { Component, EachComponentCallback } from 'types';
import { componentInfo, componentPath, componentFormPath } from './index';

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
 * @param {Boolean} runClean
 *   Whether or not to add properties (e.g. path/parent) to the component object
 */
export function eachComponent(
  components: Component[],
  fn: EachComponentCallback,
  includeAll?: boolean,
  path: string = '',
  parent?: Component,
  runClean?: boolean,
) {
  if (!components) return;
  components.forEach((component: any) => {
    if (!component) {
      return;
    }
    const info = componentInfo(component);
    let noRecurse = false;
    // Keep track of parent references.
    if (parent && !runClean) {
      // Ensure we don't create infinite JSON structures.
      Object.defineProperty(component, 'parent', {
        enumerable: false,
        writable: true,
        value: JSON.parse(JSON.stringify(parent)),
      });
      Object.defineProperty(component.parent, 'parent', {
        enumerable: false,
        writable: true,
        value: parent.parent,
      });
      Object.defineProperty(component.parent, 'path', {
        enumerable: false,
        writable: true,
        value: parent.path,
      });
      delete component.parent.components;
      delete component.parent.componentMap;
      delete component.parent.columns;
      delete component.parent.rows;
    }

    const compPath = componentPath(component, path);

    if (!runClean) {
      Object.defineProperty(component, 'path', {
        enumerable: false,
        writable: true,
        value: compPath,
      });
    }

    if (includeAll || component.tree || !info.layout) {
      noRecurse = !!fn(component, compPath, components, parent);
    }

    if (!noRecurse) {
      if (info.hasColumns) {
        component.columns.forEach((column: any) =>
          eachComponent(
            column.components,
            fn,
            includeAll,
            path,
            parent ? component : null,
            runClean,
          ),
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
                parent ? component : null,
                runClean,
              ),
            );
          }
        });
      } else if (info.hasComps) {
        eachComponent(
          component.components,
          fn,
          includeAll,
          componentFormPath(component, path, compPath),
          parent ? component : null,
          runClean,
        );
      }
    }
  });
}
