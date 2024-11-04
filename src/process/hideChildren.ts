import {
  ProcessorScope,
  ProcessorContext,
  ProcessorInfo,
  ProcessorFnSync,
  ConditionsScope,
  ProcessorFn,
} from 'types';
import { registerEphermalState } from 'utils';
import { getComponentAbsolutePath } from 'utils/formUtil';

/**
 * This processor function checks components for the `hidden` property and, if children are present, sets them to hidden as well.
 */
export const hideChildrenProcessor: ProcessorFnSync<ConditionsScope> = (context) => {
  const { component, path, parent, scope } = context;
  const absolutePath = getComponentAbsolutePath(component) || path;
  // Check if there's a conditional set for the component and if it's marked as conditionally hidden
  const isConditionallyHidden = scope.conditionals?.find((cond) => {
    return absolutePath === cond.path && cond.conditionallyHidden;
  });

  if (!scope.conditionals) {
    scope.conditionals = [];
  }

  if (isConditionallyHidden || component.hidden || parent?.ephermalState?.conditionallyHidden) {
    registerEphermalState(component, 'conditionallyHidden', true);
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
