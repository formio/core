import { assign } from 'lodash';
import {
  ProcessorFnSync,
  ProcessorFn,
  ProcessorInfo,
  ProcessorContext,
  ProcessorScope,
} from 'types';

export const serverOverrideProcess: ProcessorFn<ProcessorScope> = async (context) => {
  return serverOverrideProcessSync(context);
};

export const serverOverrideProcessSync: ProcessorFnSync<ProcessorScope> = (context) => {
  const { component } = context;
  assign(component, component.serverOverride || {});
};

export const serverOverrideProcessInfo: ProcessorInfo<ProcessorContext<ProcessorScope>, void> = {
  name: 'serverOverride',
  shouldProcess: () => true,
  process: serverOverrideProcess,
  processSync: serverOverrideProcessSync,
};
