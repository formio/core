import { Component } from 'types';
import { componentInfo, setDefaultComponentPaths, setParentReference } from './index';

// Async each component.
export async function eachComponentAsync(
  components: Component[],
  fn: any,
  includeAll = false,
  parent?: any,
) {
  if (!components) return;
  for (let i = 0; i < components.length; i++) {
    if (!components[i]) {
      continue;
    }
    const component: any = components[i];
    const info = componentInfo(component);
    setParentReference(component, parent);
    setDefaultComponentPaths(component);

    if (includeAll || component.tree || !info.layout) {
      const path = includeAll ? component.scope?.fullPath || '' : component.path || '';
      if (await fn(component, path, components, parent)) {
        continue;
      }
    }
    if (info.hasColumns) {
      for (let j = 0; j < component.columns.length; j++) {
        await eachComponentAsync(component.columns[j]?.components, fn, includeAll, component);
      }
    } else if (info.hasRows) {
      for (let j = 0; j < component.rows.length; j++) {
        const row = component.rows[j];
        if (Array.isArray(row)) {
          for (let k = 0; k < row.length; k++) {
            await eachComponentAsync(row[k]?.components, fn, includeAll, component);
          }
        }
      }
    } else if (info.hasComps) {
      await eachComponentAsync(component.components, fn, includeAll, component);
    }
  }
}
