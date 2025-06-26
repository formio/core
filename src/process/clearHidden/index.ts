import { unset } from 'lodash';
import {
  ProcessorContext,
  ProcessorInfo,
  ProcessorFnSync,
  ConditionsScope,
  ProcessorFn,
  FilterScope,
} from 'types';
import { getModelType, setComponentScope } from 'utils/formUtil';

export type ClearHiddenScope = FilterScope & {
  clearHidden: {
    [path: string]: boolean;
  };
};

/**
 * This processor function checks components for the `hidden` property and unsets corresponding data
 */
export const clearHiddenProcessSync: ProcessorFnSync<ClearHiddenScope> = (context) => {
  const { component, data, value, scope, path, parent } = context;

  // Check if there's a conditional set for the component and if it's marked as conditionally hidden
  const isConditionallyHidden =
    parent?.scope?.conditionallyHidden ||
    (scope as ConditionsScope).conditionals?.find((cond) => {
      return path === cond.path && cond.conditionallyHidden;
    });

  if (isConditionallyHidden) {
    setComponentScope(component, 'conditionallyHidden', true);
  }

  if (
    parent?.scope?.intentionallyHidden ||
    (component.hasOwnProperty('hidden') && !!component.hidden)
  ) {
    setComponentScope(component, 'intentionallyHidden', true);
  }

  const compModel = getModelType(component);

  // No need to unset the value if it's undefined or is a non-data component.
  if (value === undefined || !component.type || compModel === 'none' || compModel === 'content') {
    return;
  }

  const shouldClearValueWhenHidden =
    !component.hasOwnProperty('clearOnHide') || component.clearOnHide;

  if (
    shouldClearValueWhenHidden &&
    (isConditionallyHidden || component.scope?.conditionallyHidden)
  ) {
    unset(data, path);
    if (!scope.clearHidden) scope.clearHidden = {};
    scope.clearHidden[path] = true;

    // Make sure the filter does not include the value back.
    if (!scope.filter) scope.filter = {};
    scope.filter[path] = false;
  }
};

export const clearHiddenProcess: ProcessorFn<ClearHiddenScope> = async (context) => {
  return clearHiddenProcessSync(context);
};

export const clearHiddenProcessInfo: ProcessorInfo<ProcessorContext<ClearHiddenScope>, void> = {
  name: 'clearHidden',
  shouldProcess: () => true,
  process: clearHiddenProcess,
  processSync: clearHiddenProcessSync,
};
