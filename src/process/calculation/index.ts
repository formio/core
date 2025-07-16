import {
  ProcessorFn,
  ProcessorFnSync,
  CalculationScope,
  CalculationContext,
  ProcessorInfo,
  FetchScope,
} from 'types';
import { set, isUndefined } from 'lodash';
import { evaluate } from 'utils';

export const shouldCalculate = (context: CalculationContext): boolean => {
  const { component, config, value, parent } = context;
  if (!component.calculateValue || (config?.server && !component.calculateServer)) {
    return false;
  }
  if (isUndefined(value) && parent?.modelType === 'nestedArray') {
    return false;
  }
  return true;
};

export const calculateProcessSync: ProcessorFnSync<CalculationScope> = (
  context: CalculationContext,
) => {
  const { component, data, scope, path, value } = context;
  if (!shouldCalculate(context) || !component.calculateValue) {
    return;
  }

  const calculationContext = (scope as FetchScope).fetched
    ? { ...context, data: { ...data, ...(scope as FetchScope).fetched } }
    : context;

  if (!scope.calculated) scope.calculated = [];
  const newValue = evaluate(
    component.calculateValue,
    calculationContext,
    'value',
    false,
    (context) => {
      context.value = value || null;
    },
  );

  // Only set a new value if it is not "null" which would be the case if no calculation occurred.
  if (newValue !== null) {
    scope.calculated.push({
      path,
      value: newValue,
    });
    set(data, path, newValue);
    if (!scope.filter) scope.filter = {};
    if (!(scope as any).clearHidden?.hasOwnProperty(path)) {
      scope.filter[path] = true;
    }
  }
  return;
};

export const calculateProcess: ProcessorFn<CalculationScope> = async (
  context: CalculationContext,
) => {
  return calculateProcessSync(context);
};

export const calculateProcessInfo: ProcessorInfo<CalculationContext, void> = {
  name: 'calculate',
  process: calculateProcess,
  processSync: calculateProcessSync,
  shouldProcess: shouldCalculate,
};
