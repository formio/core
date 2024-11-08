import { get } from 'lodash';
import {
  Component,
  DataObject,
  EachComponentDataCallback,
  HasChildComponents,
  HasColumns,
  HasRows,
} from 'types';
import {
  isComponentNestedDataType,
  componentInfo,
  getContextualRowData,
  shouldProcessComponent,
  componentPath,
  setComponentScope,
  resetComponentScope,
  COMPONENT_PATH,
  setComponentPaths,
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
  parent?: Component,
  includeAll: boolean = false,
) => {
  if (!components) {
    return;
  }
  return eachComponent(
    components,
    (component, compPath, componentComponents, compParent) => {
      setComponentPaths(component, {
        dataPath: componentPath(component, COMPONENT_PATH.DATA),
        localDataPath: componentPath(component, COMPONENT_PATH.LOCAL_DATA),
      });
      const row = getContextualRowData(component, data);
      if (
        fn(
          component,
          data,
          row,
          component.scope?.dataPath || '',
          componentComponents,
          component.scope?.dataIndex,
          compParent,
        ) === true
      ) {
        resetComponentScope(component);
        return true;
      }
      if (isComponentNestedDataType(component)) {
        const value = get(data, component.scope?.dataPath || '') as DataObject;
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            setComponentScope(component, 'dataIndex', i);
            eachComponentData(component.components, data, fn, component, includeAll);
          }
          resetComponentScope(component);
          return true;
        } else {
          if (!includeAll && !shouldProcessComponent(component, row, value)) {
            resetComponentScope(component);
            return true;
          }
          eachComponentData(component.components, data, fn, component, includeAll);
        }
        resetComponentScope(component);
        return true;
      } else if (!component.type || component.modelType === 'none') {
        const info = componentInfo(component);
        if (info.hasColumns) {
          (component as HasColumns).columns.forEach((column: any) =>
            eachComponentData(column.components, data, fn, component),
          );
        } else if (info.hasRows) {
          (component as HasRows).rows.forEach((row: any) => {
            if (Array.isArray(row)) {
              row.forEach((row) => eachComponentData(row.components, data, fn, component));
            }
          });
        } else if (info.hasComps) {
          eachComponentData((component as HasChildComponents).components, data, fn, component);
        }
        resetComponentScope(component);
        return true;
      }
      resetComponentScope(component);
      return false;
    },
    true,
    parent,
  );
};
