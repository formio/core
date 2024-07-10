import {
  FilterContext,
  FilterScope,
  ProcessorFn,
  ProcessorFnSync,
  ProcessorInfo,
} from 'types';
import set from 'lodash/fp/set';
import { Utils } from 'utils';
import { get } from 'lodash';
import { getComponentAbsolutePath } from 'utils/formUtil';
export const filterProcessSync: ProcessorFnSync<FilterScope> = (
  context: FilterContext
) => {
  const { scope, component } = context;
  let { value } = context;
  const absolutePath = getComponentAbsolutePath(component);

  if (!scope.filter) scope.filter = {};
  if (value !== undefined) {
    const modelType = Utils.getModelType(component);
    switch (modelType) {
      case 'dataObject':
        scope.filter[absolutePath] = {
          compModelType: modelType,
          include: true,
          value: { data: {} },
        };
        break;
      case 'array':
        scope.filter[absolutePath] = {
          compModelType: modelType,
          include: true,
        };
        break;
      case 'object':
        if (component.type !== 'container') {
          scope.filter[absolutePath] = {
            compModelType: modelType,
            include: true,
          };
        }
        break;
      default:
        scope.filter[absolutePath] = {
          compModelType: modelType,
          include: true,
        };
        break;
    }
  }
};

export const filterProcess: ProcessorFn<FilterScope> = async (
  context: FilterContext
) => {
  return filterProcessSync(context);
};

export const filterPostProcess: ProcessorFnSync<FilterScope> = (
  context: FilterContext
) => {
  const { scope, component, submission } = context;
  let filtered: Record<string, object> = {};
  for (const path in scope.filter) {
    let value = get(submission?.data, path) as any;
    const pathFilter = scope.filter[path];

    if (pathFilter.compModelType === 'array') {
      // special case for array, if it's empty, set it to empty array
      if(value.length === 0) {
        filtered[path] = []
      }
      continue;
    } else if (pathFilter) {
      // when it's a dataModel Object, don't set values directly on the data object, let child fields do that.
      // it can have extra data on updates, so pass all other values except data
      // standard lodash set function will mutate original value, using the functional version so it doesn't
      if (pathFilter.compModelType === 'dataObject') {
        const { data, ...rest } = value;
        filtered = set(path, rest)(filtered);
      } else {
        filtered = set(path, value)(filtered);
      }
    }
  }
  context.data = filtered;
};

export const filterProcessInfo: ProcessorInfo<FilterContext, void> = {
  name: 'filter',
  process: filterProcess,
  processSync: filterProcessSync,
  postProcess: filterPostProcess,
  shouldProcess: (context: FilterContext) => true,
};
