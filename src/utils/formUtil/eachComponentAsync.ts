import { Component, EachComponentAsyncCallback, ComponentPaths } from 'types';
import { componentInfo, getComponentPaths } from './index';

// Async each component.
export async function eachComponentAsync(
  components: Component[],
  fn: EachComponentAsyncCallback,
  includeAll = false,
  parentPaths?: string | ComponentPaths,
  parent?: any,
) {
  if (!components) return;
  if (typeof parentPaths === 'string') {
    parentPaths = { path: parentPaths };
  }
  for (let i = 0; i < components.length; i++) {
    if (!components[i]) {
      continue;
    }
    const component: any = components[i];
    const info = componentInfo(component);
    const compPaths = getComponentPaths(component, parent, parentPaths);
    if (includeAll || component.tree || !info.layout) {
      const path = includeAll ? compPaths.fullPath : compPaths.path;
      if (await fn(component, path || '', components, parent, compPaths)) {
        continue;
      }
    }
    if (info.hasColumns) {
      for (let j = 0; j < component.columns.length; j++) {
        await eachComponentAsync(
          component.columns[j]?.components,
          fn,
          includeAll,
          compPaths,
          component,
        );
      }
    } else if (info.hasRows) {
      for (let j = 0; j < component.rows.length; j++) {
        const row = component.rows[j];
        if (Array.isArray(row)) {
          for (let k = 0; k < row.length; k++) {
            await eachComponentAsync(row[k]?.components, fn, includeAll, compPaths, component);
          }
        }
      }
    } else if (info.hasComps) {
      await eachComponentAsync(component.components, fn, includeAll, compPaths, component);
    }
  }
}
