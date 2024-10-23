import { get } from 'lodash';
import { ProcessorContext, Component } from 'types';
export const generateProcessorContext = <ProcessorScope>(
  component: Component,
  data: any,
): ProcessorContext<ProcessorScope> => {
  return {
    component,
    path: component.key,
    data,
    row: data,
    scope: {} as ProcessorScope,
    value: get(data, component.key),
  };
};
