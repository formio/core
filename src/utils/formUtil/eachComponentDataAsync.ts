import { get } from 'lodash';

import { Component, DataObject, EachComponentDataAsyncCallback, HasColumns, HasRows } from 'types';
import {
  isComponentNestedDataType,
  componentInfo,
  getContextualRowData,
  shouldProcessComponent,
  setComponentScope,
  resetComponentScope,
  componentPath,
  COMPONENT_PATH,
  setComponentPaths,
} from './index';
import { eachComponentAsync } from './eachComponentAsync';

// Async each component data.
export const eachComponentDataAsync = async (
  components: Component[],
  data: DataObject,
  fn: EachComponentDataAsyncCallback,
  parent?: Component,
  includeAll: boolean = false,
) => {
  if (!components || !data) {
    return;
  }
  return await eachComponentAsync(
    components,
    async (component: any, compPath: string, componentComponents: any, compParent: any) => {
      setComponentPaths(component, {
        dataPath: componentPath(component, COMPONENT_PATH.DATA),
        localDataPath: componentPath(component, COMPONENT_PATH.LOCAL_DATA),
      });
      const row = getContextualRowData(component, data);
      if (
        (await fn(
          component,
          data,
          row,
          component.scope?.dataPath || '',
          componentComponents,
          component.scope?.dataIndex,
          compParent,
        )) === true
      ) {
        resetComponentScope(component);
        return true;
      }
      if (isComponentNestedDataType(component)) {
        const value = get(data, component.scope?.dataPath || '');
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            setComponentScope(component, 'dataIndex', i);
            await eachComponentDataAsync(component.components, data, fn, component, includeAll);
          }
          resetComponentScope(component);
          return true;
        } else {
          if (!includeAll && !shouldProcessComponent(component, row, value)) {
            resetComponentScope(component);
            return true;
          }
          await eachComponentDataAsync(component.components, data, fn, component, includeAll);
        }
        resetComponentScope(component);
        return true;
      } else if (!component.type || component.modelType === 'none') {
        const info = componentInfo(component);
        if (info.hasColumns) {
          const columnsComponent = component as HasColumns;
          for (const column of columnsComponent.columns) {
            await eachComponentDataAsync(column.components, data, fn, component);
          }
        } else if (info.hasRows) {
          const rowsComponent = component as HasRows;
          for (const rowArray of rowsComponent.rows) {
            if (Array.isArray(rowArray)) {
              for (const row of rowArray) {
                await eachComponentDataAsync(row.components, data, fn, component);
              }
            }
          }
        } else if (info.hasComps) {
          await eachComponentDataAsync(component.components, data, fn, component);
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
