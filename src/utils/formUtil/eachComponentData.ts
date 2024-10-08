import { isEmpty, get, set, has } from "lodash";

import { Component, DataObject, EachComponentDataCallback, HasChildComponents, HasColumns, HasRows } from "types";
import { getContextualRowData, isComponentNestedDataType, getModelType, componentDataPath, componentInfo, componentFormPath } from "./index";
import { eachComponent } from "./eachComponent";
import { resetEphermalState } from "../utils";

export const eachComponentData = (
    components: Component[],
    data: DataObject,
    fn: EachComponentDataCallback,
    path = "",
    index?: number,
    parent?: Component,
    includeAll: boolean = false,
  ) => {
    if (!components || !data) {
      return;
    }
    return eachComponent(
      components,
      (component, compPath, componentComponents, compParent) => {
        const row = getContextualRowData(component, compPath, data);
        if (fn(component, data, row, compPath, componentComponents, index, compParent) === true) {
          return true;
        }
        if (isComponentNestedDataType(component)) {
          const value = get(data, compPath, data) as DataObject;
          if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
              const nestedComponentPath = getModelType(component) === 'nestedDataArray' ? `${compPath}[${i}].data` : `${compPath}[${i}]`;
              eachComponentData(component.components, data, fn, nestedComponentPath, i, component, includeAll);
            }
            return true;
          } else if (isEmpty(row) && !includeAll) {
            // Tree components may submit empty objects; since we've already evaluated the parent tree/layout component, we won't worry about constituent elements
            return true;
          }
          if (getModelType(component) === 'dataObject') {
            // No need to bother processing all the children data if there is no data for this form or the reference value has not been loaded.
            const nestedFormValue: any = get(data, component.path);
            const noReferenceAttached = nestedFormValue?._id && isEmpty(nestedFormValue.data) && !has(nestedFormValue, 'form');
            const shouldProcessNestedFormData = nestedFormValue?._id ? !noReferenceAttached : has(data, component.path);
            if (shouldProcessNestedFormData) {
              // For nested forms, we need to reset the "data" and "path" objects for all of the children components, and then re-establish the data when it is done.
              const childPath: string = componentDataPath(component, path, compPath);
              const childData: any = get(data, childPath, {});
              eachComponentData(component.components, childData, fn, '', index, component, includeAll);
              set(data, childPath, childData);
            }
          }
          else {
            eachComponentData(component.components, data, fn, componentDataPath(component, path, compPath), index, component, includeAll);
          }
          return true;
        } else if (getModelType(component) === 'none') {
            const info = componentInfo(component);
            if (info.hasColumns) {
                const columnsComponent = component as HasColumns;
                columnsComponent.columns.forEach((column: any) =>
                  eachComponentData(
                    column.components,
                    data,
                    fn,
                    componentFormPath(columnsComponent, path, columnsComponent.path),
                    index,
                    component,
                  )
                );
              } else if (info.hasRows) {
                const rowsComponent = component as HasRows;
                rowsComponent.rows.forEach((row: any) => {
                  if (Array.isArray(row)) {
                    row.forEach((row) =>
                        eachComponentData(
                            row.components,
                            data,
                            fn,
                            componentFormPath(rowsComponent, path, rowsComponent.path),
                            index,
                            component,
                        )
                    );
                  }
                });
              } else if (info.hasComps) {
                const componentWithChildren = component as HasChildComponents;
                eachComponentData(
                  componentWithChildren.components,
                  data,
                  fn,
                  componentFormPath(componentWithChildren, path, componentWithChildren.path),
                  index,
                  component
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
