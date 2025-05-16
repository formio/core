import { unset } from 'lodash';
import {
  ProcessorScope,
  ProcessorContext,
  ProcessorInfo,
  ProcessorFnSync,
  ConditionsScope,
  ProcessorFn,
} from 'types';

type ClearHiddenScope = ProcessorScope & {
  clearHidden: {
    [path: string]: boolean;
  };
};

/**
 * This processor function checks components for the `hidden` property and unsets corresponding data
 */
export const clearHiddenProcessSync: ProcessorFnSync<ClearHiddenScope> = (context) => {
  const { component, data, value, scope, path } = context;

  // No need to unset the value if it's undefined
  if (value === undefined) {
    return;
  }

  if (!scope.clearHidden) {
    scope.clearHidden = {};
  }

  // Check if there's a conditional set for the component and if it's marked as conditionally hidden
  const isConditionallyHidden = (scope as ConditionsScope).conditionals?.find((cond) => {
    return path === cond.path && cond.conditionallyHidden;
  });

  const shouldClearValueWhenHidden =
    !component.hasOwnProperty('clearOnHide') || component.clearOnHide;

  if (
    shouldClearValueWhenHidden &&
    (isConditionallyHidden || component.scope?.conditionallyHidden)
  ) {
    unset(data, path);
    scope.clearHidden[path] = true;
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
