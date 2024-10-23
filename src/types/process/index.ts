import {
  calculateProcessInfo,
  conditionProcessInfo,
  defaultValueProcessInfo,
  fetchProcessInfo,
  filterProcessInfo,
  logicProcessInfo,
  populateProcessInfo,
  validateProcessInfo,
} from 'processes';
import { ProcessorInfo } from './ProcessorInfo';

export * from './ProcessType';
export * from './ProcessorType';
export * from './ProcessorContext';
export * from './ProcessorFn';
export * from './ProcessContext';
export * from './ProcessorContext';
export * from './ProcessorScope';
export * from './ProcessorsScope';
export * from './ProcessConfig';
export * from './ProcessorInfo';
export * from './validation';
export * from './calculation';
export * from './conditions';
export * from './defaultValue';
export * from './fetch';
export * from './filter';
export * from './populate';
export * from './logic';

export const processes = {
  calculation: calculateProcessInfo,
  conditions: conditionProcessInfo,
  defaultValue: defaultValueProcessInfo,
  fetch: fetchProcessInfo,
  filter: filterProcessInfo,
  logic: logicProcessInfo,
  populate: populateProcessInfo,
  validation: validateProcessInfo,
};

export type ProcessTarget = Record<string, ProcessorInfo<any, any>[]>;
