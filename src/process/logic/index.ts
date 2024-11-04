import { LogicContext, LogicScope, ProcessorFn, ProcessorFnSync } from 'types';
import { applyActions, hasLogic } from 'utils/logic';

// This processor ensures that a "linked" row context is provided to every component.
export const logicProcessSync: ProcessorFnSync<LogicScope> = (context: LogicContext) => {
  return applyActions(context);
};

export const logicProcess: ProcessorFn<LogicScope> = async (context: LogicContext) => {
  return logicProcessSync(context);
};

export const logicProcessInfo = {
  name: 'logic',
  process: logicProcess,
  processSync: logicProcessSync,
  shouldProcess: hasLogic,
};
