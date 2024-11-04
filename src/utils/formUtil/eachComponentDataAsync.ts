import { get, set, has, isEmpty } from 'lodash';

import {
  Component,
  DataObject,
  EachComponentDataAsyncCallback,
  HasChildComponents,
  HasColumns,
  HasRows,
} from 'types';
import {
  getContextualRowData,
  isComponentNestedDataType,
  getModelType,
  componentDataPath,
  componentInfo,
  componentFormPath,
} from './index';
import { eachComponentAsync } from './eachComponentAsync';

// Async each component data.
export const eachComponentDataAsync = async (
  components: Component[],
  data: DataObject,
  fn: EachComponentDataAsyncCallback,
  path = '',
  index?: number,
  parent?: Component,
  includeAll: boolean = false,
) => {
  if (!components || !data) {
    return;
  }
  return await eachComponentAsync(
    components,
    async (component: any, compPath: string, componentComponents: any, compParent: any) => {
      const row = getContextualRowData(component, compPath, data);
      if (
        (await fn(component, data, row, compPath, componentComponents, index, compParent)) === true
      ) {
        return true;
      }
      if (isComponentNestedDataType(component)) {
        const value = get(data, compPath, data);
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            const nestedComponentPath =
              getModelType(component) === 'nestedDataArray'
                ? `${compPath}[${i}].data`
                : `${compPath}[${i}]`;
            await eachComponentDataAsync(
              component.components,
              data,
              fn,
              nestedComponentPath,
              i,
              component,
              includeAll,
            );
          }
          return true;
        } else if (isEmpty(row) && !includeAll) {
          // Tree components may submit empty objects; since we've already evaluated the parent tree/layout component, we won't worry about constituent elements
          return true;
        }
        if (getModelType(component) === 'dataObject') {
          // No need to bother processing all the children data if there is no data for this form or the reference value has not been loaded.
          const nestedFormValue: any = get(data, component.path);
          const noReferenceAttached =
            nestedFormValue?._id && isEmpty(nestedFormValue.data) && !has(nestedFormValue, 'form');
          const shouldProcessNestedFormData = nestedFormValue?._id
            ? !noReferenceAttached
            : has(data, component.path);
          if (shouldProcessNestedFormData) {
            // For nested forms, we need to reset the "data" and "path" objects for all of the children components, and then re-establish the data when it is done.
            const childPath: string = componentDataPath(component, path, compPath);
            const childData: any = get(data, childPath, null);
            await eachComponentDataAsync(
              component.components,
              childData,
              fn,
              '',
              index,
              component,
              includeAll,
            );
            set(data, childPath, childData);
          }
        } else {
          await eachComponentDataAsync(
            component.components,
            data,
            fn,
            componentDataPath(component, path, compPath),
            index,
            component,
            includeAll,
          );
        }
        return true;
      } else if (getModelType(component) === 'none') {
        const info = componentInfo(component);
        if (info.hasColumns) {
          const columnsComponent = component as HasColumns;
          for (const column of columnsComponent.columns) {
            await eachComponentDataAsync(column.components, data, fn, path, index, component);
          }
        } else if (info.hasRows) {
          const rowsComponent = component as HasRows;
          for (const rowArray of rowsComponent.rows) {
            if (Array.isArray(rowArray)) {
              for (const row of rowArray) {
                await eachComponentDataAsync(row.components, data, fn, path, index, component);
              }
            }
          }
        } else if (info.hasComps) {
          const componentWithChildren = component as HasChildComponents;
          await eachComponentDataAsync(
            componentWithChildren.components,
            data,
            fn,
            componentFormPath(componentWithChildren, path, componentWithChildren.path),
            index,
            component,
          );
        }
        return true;
      }
      return false;
    },
    true,
    path,
    parent,
  );
};
