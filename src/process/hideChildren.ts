import {
  ProcessorScope,
  ProcessorContext,
  ProcessorInfo,
  ProcessorFnSync,
  ConditionsScope,
  ProcessorFn,
} from 'types';
import { setComponentScope } from 'utils/formUtil';

/**
 * This processor function checks components for the `hidden` property and, if children are present, sets them to hidden as well.
 */
export const hideChildrenProcessor: ProcessorFnSync<ConditionsScope> = (context) => {
  const { component, path, parent, scope } = context;
  // Check if there's a conditional set for the component and if it's marked as conditionally hidden
  const isConditionallyHidden = scope.conditionals?.find((cond) => {
    return path === cond.path && cond.conditionallyHidden;
  });

  if (!scope.conditionals) {
    scope.conditionals = [];
  }

  if (isConditionallyHidden || parent?.scope?.conditionallyHidden) {
    setComponentScope(component, 'conditionallyHidden', true);
  }

  if (
    (component.hasOwnProperty('hidden') && !!component.hidden) ||
    parent?.scope?.intentionallyHidden
  ) {
    setComponentScope(component, 'intentionallyHidden', true);
  }
};

export const hideChildrenProcessorAsync: ProcessorFn<ProcessorScope> = async (context) => {
  return hideChildrenProcessor(context);
};

export const hideChildrenProcessorInfo: ProcessorInfo<ProcessorContext<ProcessorScope>, void> = {
  name: 'hideChildren',
  shouldProcess: () => true,
  processSync: hideChildrenProcessor,
  process: hideChildrenProcessorAsync,
};
