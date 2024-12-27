import { get } from 'lodash';
import {
  Component,
  DataObject,
  EachComponentDataCallback,
  HasChildComponents,
  HasColumns,
  HasRows,
  ComponentPaths,
} from 'types';
import {
  isComponentNestedDataType,
  componentInfo,
  getContextualRowData,
  shouldProcessComponent,
  resetComponentScope,
  getModelType,
} from './index';
import { eachComponent } from './eachComponent';

/**
 * Iterates through each component as well as its data, and triggers a callback for every component along
 * with the contextual data for that component in addition to the absolute path for that component.
 * @param components - The array of JSON components to iterate through.
 * @param data - The contextual data object for the components.
 * @param fn - The callback function to trigger for each component following the signature (component, data, row, path, components, index, parent).
 * @param parent - The parent component.
 * @param includeAll
 * @returns
 */
export const eachComponentData = (
  components: Component[],
  data: DataObject,
  fn: EachComponentDataCallback,
  includeAll: boolean = false,
  local: boolean = false,
  parent?: Component,
  parentPaths?: ComponentPaths,
) => {
  if (!components) {
    return;
  }
  return eachComponent(
    components,
    (component, compPath, componentComponents, compParent, compPaths) => {
      const row = getContextualRowData(component, data, compPaths, local);
      if (
        fn(
          component,
          data,
          row,
          compPaths?.dataPath || '',
          componentComponents,
          compPaths?.dataIndex,
          compParent,
          compPaths,
        ) === true
      ) {
        resetComponentScope(component);
        return true;
      }
      if (isComponentNestedDataType(component)) {
        const value = get(
          data,
          local ? compPaths?.localDataPath || '' : compPaths?.dataPath || '',
        ) as DataObject;
        if (
          getModelType(component) === 'nestedArray' ||
          getModelType(component) === 'nestedDataArray'
        ) {
          if (Array.isArray(value) && value.length) {
            for (let i = 0; i < value.length; i++) {
              if (compPaths) {
                compPaths.dataIndex = i;
              }
              eachComponentData(
                component.components,
                data,
                fn,
                includeAll,
                local,
                component,
                compPaths,
              );
            }
          }
          else {
            eachComponentData(component.components, data, fn, includeAll, local, component, compPaths);
          }
          resetComponentScope(component);
          return true;
        } else {
          if (!includeAll && !shouldProcessComponent(component, row, value)) {
            resetComponentScope(component);
            return true;
          }
          eachComponentData(
            component.components,
            data,
            fn,
            includeAll,
            local,
            component,
            compPaths,
          );
        }
        resetComponentScope(component);
        return true;
      } else if (!component.type || getModelType(component) === 'none') {
        const info = componentInfo(component);
        if (info.hasColumns) {
          (component as HasColumns).columns.forEach((column: any) =>
            eachComponentData(column.components, data, fn, includeAll, local, component, compPaths),
          );
        } else if (info.hasRows) {
          (component as HasRows).rows.forEach((row: any) => {
            if (Array.isArray(row)) {
              row.forEach((row) =>
                eachComponentData(
                  row.components,
                  data,
                  fn,
                  includeAll,
                  local,
                  component,
                  compPaths,
                ),
              );
            }
          });
        } else if (info.hasComps) {
          eachComponentData(
            (component as HasChildComponents).components,
            data,
            fn,
            includeAll,
            local,
            component,
            compPaths,
          );
        }
        resetComponentScope(component);
        return true;
      }
      resetComponentScope(component);
      return false;
    },
    true,
    parentPaths,
    parent,
  );
};
