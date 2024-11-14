import { Component, EachComponentCallback, ComponentPaths } from 'types';
import { componentInfo, getComponentPaths } from './index';

/**
 * Iterate through each component within a form.
 *
 * @param {Object} components
 *   The components to iterate.
 * @param {Function} fn
 *   The iteration function to invoke for each component.
 * @param {Boolean} includeAll
 *   Whether or not to include layout components.
 * @param {Object} parent
 *   The parent object.
 */
export function eachComponent(
  components: Component[],
  fn: EachComponentCallback,
  includeAll?: boolean,
  parentPaths?: string | ComponentPaths,
  parent?: Component,
) {
  if (!components) return;
  if (typeof parentPaths === 'string') {
    parentPaths = { path: parentPaths };
  }
  components.forEach((component: any) => {
    if (!component) {
      return;
    }
    const info = componentInfo(component);
    let noRecurse = false;
    const compPaths = getComponentPaths(component, parent, parentPaths);

    if (includeAll || component.tree || !info.layout) {
      const path = includeAll ? compPaths.fullPath : compPaths.path;
      noRecurse = !!fn(component, path || '', components, parent, compPaths);
    }

    if (!noRecurse) {
      if (info.hasColumns) {
        component.columns.forEach((column: any) =>
          eachComponent(column.components, fn, includeAll, compPaths, component),
        );
      } else if (info.hasRows) {
        component.rows.forEach((row: any) => {
          if (Array.isArray(row)) {
            row.forEach((column) =>
              eachComponent(column.components, fn, includeAll, compPaths, component),
            );
          }
        });
      } else if (info.hasComps) {
        eachComponent(component.components, fn, includeAll, compPaths, component);
      }
    }
  });
}
