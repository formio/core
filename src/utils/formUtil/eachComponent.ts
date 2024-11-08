import { Component, EachComponentCallback } from 'types';
import { componentInfo, setDefaultComponentPaths, setParentReference } from './index';

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
  parent?: Component,
) {
  if (!components) return;
  components.forEach((component: any) => {
    if (!component) {
      return;
    }
    const info = componentInfo(component);
    let noRecurse = false;
    setParentReference(component, parent);
    setDefaultComponentPaths(component);

    if (includeAll || component.tree || !info.layout) {
      const path = includeAll ? component.scope?.fullPath || '' : component.path || '';
      noRecurse = !!fn(component, path, components, parent);
    }

    if (!noRecurse) {
      if (info.hasColumns) {
        component.columns.forEach((column: any) =>
          eachComponent(column.components, fn, includeAll, component),
        );
      } else if (info.hasRows) {
        component.rows.forEach((row: any) => {
          if (Array.isArray(row)) {
            row.forEach((column) => eachComponent(column.components, fn, includeAll, component));
          }
        });
      } else if (info.hasComps) {
        eachComponent(component.components, fn, includeAll, component);
      }
    }
  });
}
