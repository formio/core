import {
  FilterContext,
  FilterScope,
  ProcessorFn,
  ProcessorFnSync,
  ProcessorInfo,
  ProcessorPostFn,
  ProcessorPostFnSync,
} from 'types';
import { has, set } from 'lodash';
import { get } from 'lodash';
import { getModelType } from 'utils/formUtil';
export const filterProcessSync: ProcessorFnSync<FilterScope> = (context: FilterContext) => {
  const { scope, path, value } = context;
  if (!scope.filter) scope.filter = {};
  if (value !== undefined) {
    scope.filter[path] = true;
  }
};

export const filterProcess: ProcessorFn<FilterScope> = async (context: FilterContext) => {
  return filterProcessSync(context);
};

export const filterPostProcessSync: ProcessorPostFnSync<FilterScope> = (
  context: FilterContext,
): boolean | undefined => {
  const { scope, path, data, component, value } = context;
  if (!scope.filter) scope.filter = {};
  if (value === undefined || !scope.filter[path]) {
    return;
  }
  scope.filtered = scope.filtered || {};
  const modelType = getModelType(component);
  if (
    component.type === 'address' ||
    (modelType !== 'dataObject' &&
      modelType !== 'nestedArray' &&
      modelType !== 'nestedDataArray' &&
      modelType !== 'object')
  ) {
    set(scope.filtered, path, value);
  } else {
    if (modelType === 'dataObject') {
      set(data, `${path}.data`, get(scope.filtered, `${path}.data`, value?.data || {}));
      set(scope.filtered, path, get(data, path));
    } else if (modelType === 'nestedDataArray') {
      const filtered: any = get(scope.filtered, path, []);
      set(
        scope.filtered,
        path,
        value.map((item: any, index: number) => {
          return { ...item, data: filtered[index]?.data || {} };
        }),
      );
    } else if (!has(scope.filtered, path)) {
      set(scope.filtered, path, value);
    } else {
      set(data, path, get(scope.filtered, path, value));
    }
  }
};

export const filterPostProcess: ProcessorPostFn<FilterScope> = async (context: FilterContext) => {
  return filterPostProcessSync(context);
};

export const filterProcessInfo: ProcessorInfo<FilterContext, void> = {
  name: 'filter',
  process: filterProcess,
  processSync: filterProcessSync,
  postProcess: filterPostProcess,
  postProcessSync: filterPostProcessSync,
  shouldProcess: () => true,
};
