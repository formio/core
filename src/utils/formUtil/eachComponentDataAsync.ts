import { get, set, isEmpty, has } from 'lodash';

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
  if (!components) {
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
      const modelType = getModelType(component);
      if (isComponentNestedDataType(component)) {
        const value = get(data, compPath);
        if (modelType === 'nestedArray' || modelType === 'nestedDataArray') {
          if (Array.isArray(value) && value.length) {
            for (let i = 0; i < value.length; i++) {
              const nestedComponentPath =
                modelType === 'nestedDataArray' ? `${compPath}[${i}].data` : `${compPath}[${i}]`;
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
          } else if (includeAll) {
            await eachComponentDataAsync(
              component.components,
              data,
              fn,
              modelType === 'nestedDataArray' ? `${compPath}[0].data` : `${compPath}[0]`,
              0,
              component,
              includeAll,
            );
          } else {
            // This is an empty nested array, so we do not need to process the children.
            return true;
          }
        } else if (modelType === 'dataObject') {
          const nestedFormValue: any = get(data, component.path);
          const noReferenceAttached = nestedFormValue?._id
            ? isEmpty(nestedFormValue.data) && !has(nestedFormValue, 'form')
            : false;
          const shouldBeCleared =
            (!component.hasOwnProperty('clearOnHide') || component.clearOnHide) &&
            (component.hidden || component.ephermalState?.conditionallyHidden);
          // Skip all the nested components processing if nested form is hidden and should be cleared on hide or if submission is saved as reference and not loaded
          const shouldSkipProcessingNestedFormData = noReferenceAttached || shouldBeCleared;
          if (!shouldSkipProcessingNestedFormData) {
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
      } else if (modelType === 'none') {
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
