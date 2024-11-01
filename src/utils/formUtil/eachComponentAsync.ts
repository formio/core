import { componentInfo, componentPath, componentFormPath } from './index';

// Async each component.
export async function eachComponentAsync(
  components: any[],
  fn: any,
  includeAll = false,
  path = '',
  parent?: any,
  noComponentChange?: boolean,
) {
  if (!components) return;
  for (let i = 0; i < components.length; i++) {
    if (!components[i]) {
      continue;
    }
    const component = components[i];
    const info = componentInfo(component);
    // Keep track of parent references.
    if (parent && !noComponentChange) {
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

    if (!noComponentChange) {
      Object.defineProperty(component, 'path', {
        enumerable: false,
        writable: true,
        value: compPath,
      });
    }
    if (includeAll || component.tree || !info.layout) {
      if (await fn(component, compPath, components, parent)) {
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
          parent ? component : null,
          noComponentChange,
        );
      }
    } else if (info.hasRows) {
      for (let j = 0; j < component.rows.length; j++) {
        const row = component.rows[j];
        if (Array.isArray(row)) {
          for (let k = 0; k < row.length; k++) {
            await eachComponentAsync(
              row[k]?.components,
              fn,
              includeAll,
              path,
              parent ? component : null,
              noComponentChange,
            );
          }
        }
      }
    } else if (info.hasComps) {
      await eachComponentAsync(
        component.components,
        fn,
        includeAll,
        componentFormPath(component, path, compPath),
        parent ? component : null,
        noComponentChange,
      );
    }
  }
}
