import { FilterContext, FilterScope, ProcessorFn, ProcessorFnSync, ProcessorInfo } from 'types';
import { set } from 'lodash';
import { get, isObject } from 'lodash';
import { getModelType } from 'utils/formUtil';
export const filterProcessSync: ProcessorFnSync<FilterScope> = (context: FilterContext) => {
  const { scope, component, path } = context;
  const { value } = context;
  if (!scope.filter) scope.filter = {};
  if (value !== undefined || component.type === 'datasource') {
    const modelType = getModelType(component);
    switch (modelType) {
      case 'dataObject':
        scope.filter[path] = {
          compModelType: modelType,
          include: true,
          value: { data: {} },
        };
        break;
      case 'nestedArray':
        scope.filter[path] = {
          compModelType: modelType,
          include: true,
          value: [],
        };
        break;
      case 'nestedDataArray':
        scope.filter[path] = {
          compModelType: modelType,
          include: true,
          value: Array.isArray(value) ? value.map((v) => ({ ...v, data: {} })) : [],
        };
        break;
      case 'object':
        scope.filter[path] = {
          compModelType: modelType,
          include: true,
          value: component.type === 'address' ? false : {},
        };
        break;
      default:
        scope.filter[path] = {
          compModelType: modelType,
          include: true,
        };
        break;
    }
  }
};

export const filterProcess: ProcessorFn<FilterScope> = async (context: FilterContext) => {
  return filterProcessSync(context);
};

export const filterPostProcess: ProcessorFnSync<FilterScope> = (context: FilterContext) => {
  const { scope, submission } = context;
  const filtered = {};
  for (const path in scope.filter) {
    if (scope.filter[path].include) {
      let value = get(submission?.data, path);
      if (scope.filter[path].value) {
        if (isObject(value) && scope.filter[path].value?.data) {
          value = { ...value, ...scope.filter[path].value };
        } else {
          value = scope.filter[path].value;
        }
      }
      set(filtered, path, value);
    }
  }
  context.data = filtered;
};

export const filterProcessInfo: ProcessorInfo<FilterContext, void> = {
  name: 'filter',
  process: filterProcess,
  processSync: filterProcessSync,
  postProcess: filterPostProcess,
  shouldProcess: () => true,
};
