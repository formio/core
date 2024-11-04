import { unset } from 'lodash';
import {
  ProcessorScope,
  ProcessorContext,
  ProcessorInfo,
  ProcessorFnSync,
  ConditionsScope,
} from 'types';
import { getComponentAbsolutePath } from 'utils/formUtil';

type ClearHiddenScope = ProcessorScope & {
  clearHidden: {
    [path: string]: boolean;
  };
};

/**
 * This processor function checks components for the `hidden` property and unsets corresponding data
 */
export const clearHiddenProcess: ProcessorFnSync<ClearHiddenScope> = (context) => {
  const { component, data, value, scope, path } = context;
  const absolutePath = getComponentAbsolutePath(component) || path;

  // No need to unset the value if it's undefined
  if (value === undefined) {
    return;
  }

  if (!scope.clearHidden) {
    scope.clearHidden = {};
  }

  // Check if there's a conditional set for the component and if it's marked as conditionally hidden
  const isConditionallyHidden = (scope as ConditionsScope).conditionals?.find((cond) => {
    return absolutePath === cond.path && cond.conditionallyHidden;
  });

  const shouldClearValueWhenHidden =
    !component.hasOwnProperty('clearOnHide') || component.clearOnHide;

  if (
    shouldClearValueWhenHidden &&
    (isConditionallyHidden || component.ephemeralState?.conditionallyHidden)
  ) {
    unset(data, absolutePath);
    scope.clearHidden[absolutePath] = true;
  }
};

export const clearHiddenProcessInfo: ProcessorInfo<ProcessorContext<ClearHiddenScope>, void> = {
  name: 'clearHidden',
  shouldProcess: () => true,
  processSync: clearHiddenProcess,
};
