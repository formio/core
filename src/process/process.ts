import { FilterScope, ProcessContext, ProcessTarget, ProcessorInfo, ProcessorScope } from 'types';
import { eachComponentData, eachComponentDataAsync } from 'utils/formUtil';
import { postProcessOne, postProcessOneSync, processOne, processOneSync } from './processOne';
import {
  defaultValueProcessInfo,
  serverDefaultValueProcessInfo,
  customDefaultValueProcessInfo,
} from './defaultValue';
import { fetchProcessInfo } from './fetch';
import { calculateProcessInfo } from './calculation';
import { logicProcessInfo } from './logic';
import {
  conditionProcessInfo,
  customConditionProcessInfo,
  simpleConditionProcessInfo,
} from './conditions';
import {
  postValidateProcessInfo,
  validateCustomProcessInfo,
  validateProcessInfo,
  validateServerProcessInfo,
} from './validation';
import { filterProcessInfo } from './filter';
import { normalizeProcessInfo } from './normalize';
import { dereferenceProcessInfo } from './dereference';
import { clearHiddenProcessInfo } from './clearHidden';

export async function process<ProcessScope>(
  context: ProcessContext<ProcessScope>,
): Promise<ProcessScope> {
  const { instances, components, data, scope, flat, local, parent, parentPaths } = context;
  await eachComponentDataAsync(
    components,
    data,
    async (component, compData, row, path, components, index, parent, paths) => {
      await processOne<ProcessScope>({
        ...context,
        data: compData,
        component,
        components,
        path,
        paths,
        row,
        index,
        instance: instances
          ? instances[component.modelType === 'none' && paths?.fullPath ? paths.fullPath : path]
          : undefined,
        parent,
      });
      if (flat) {
        return true;
      }
      if ((scope as ProcessorScope).noRecurse) {
        (scope as ProcessorScope).noRecurse = false;
        return true;
      }
    },
    false,
    local,
    parent,
    parentPaths,
    false,
    async (component, compData, row, path, components, index, parent, paths) => {
      await postProcessOne<ProcessScope>({
        ...context,
        data: compData,
        component,
        components,
        path,
        paths,
        row,
        index,
        instance: instances
          ? instances[component.modelType === 'none' && paths?.fullPath ? paths.fullPath : path]
          : undefined,
        parent,
      });
    },
  );
  if ((scope as FilterScope).filtered) {
    context.data = (scope as FilterScope).filtered || {};
  }
  return scope;
}

export function processSync<ProcessScope>(context: ProcessContext<ProcessScope>): ProcessScope {
  const { instances, components, data, scope, flat, local, parent, parentPaths } = context;
  eachComponentData(
    components,
    data,
    (component, compData, row, path, components, index, parent, paths) => {
      processOneSync<ProcessScope>({
        ...context,
        data: compData,
        component,
        components,
        path,
        paths,
        row,
        index,
        instance: instances
          ? instances[component.modelType === 'none' && paths?.fullPath ? paths.fullPath : path]
          : undefined,
        parent,
      });
      if (flat) {
        return true;
      }
      if ((scope as ProcessorScope).noRecurse) {
        (scope as ProcessorScope).noRecurse = false;
        return true;
      }
    },
    false,
    local,
    parent,
    parentPaths,
    false,
    (component, compData, row, path, components, index, parent, paths) => {
      postProcessOneSync<ProcessScope>({
        ...context,
        data: compData,
        component,
        components,
        path,
        paths,
        row,
        index,
        instance: instances
          ? instances[component.modelType === 'none' && paths?.fullPath ? paths.fullPath : path]
          : undefined,
        parent,
      });
    },
  );
  if ((scope as FilterScope).filtered) {
    context.data = (scope as FilterScope).filtered || {};
  }
  return scope;
}

export const ProcessorMap: Record<string, ProcessorInfo<any, any>> = {
  filter: filterProcessInfo,
  defaultValue: defaultValueProcessInfo,
  serverDefaultValue: serverDefaultValueProcessInfo,
  customDefaultValue: customDefaultValueProcessInfo,
  calculate: calculateProcessInfo,
  conditions: conditionProcessInfo,
  customConditions: customConditionProcessInfo,
  simpleConditions: simpleConditionProcessInfo,
  normalize: normalizeProcessInfo,
  dereference: dereferenceProcessInfo,
  clearHidden: clearHiddenProcessInfo,
  fetch: fetchProcessInfo,
  logic: logicProcessInfo,
  validate: validateProcessInfo,
  validateCustom: validateCustomProcessInfo,
  validateServer: validateServerProcessInfo,
};

export const Processors: ProcessorInfo<any, any>[] = [
  filterProcessInfo,
  defaultValueProcessInfo,
  normalizeProcessInfo,
  dereferenceProcessInfo,
  fetchProcessInfo,
  calculateProcessInfo,
  conditionProcessInfo,
  logicProcessInfo,
  clearHiddenProcessInfo,
  postValidateProcessInfo,
];

// Deprecated: Use Processors instead
export const ProcessTargets: ProcessTarget = {
  submission: [
    filterProcessInfo,
    serverDefaultValueProcessInfo,
    normalizeProcessInfo,
    dereferenceProcessInfo,
    fetchProcessInfo,
    simpleConditionProcessInfo,
    validateServerProcessInfo,
  ],
  evaluator: [
    customDefaultValueProcessInfo,
    calculateProcessInfo,
    logicProcessInfo,
    conditionProcessInfo,
    clearHiddenProcessInfo,
    validateProcessInfo,
  ],
};
