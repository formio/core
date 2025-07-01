export type ProcessCheckFn<ProcessorContext> = (context: ProcessorContext) => boolean;
export type ProcessorInfo<ProcessorContext, ProcessorReturnType> = {
  name: string;
  fullValue?: boolean;
  process?: (context: ProcessorContext) => Promise<ProcessorReturnType>;
  processSync?: (context: ProcessorContext) => ProcessorReturnType;
  postProcess?: (context: ProcessorContext) => Promise<void>;
  postProcessSync?: (context: ProcessorContext) => void;
  shouldProcess: ProcessCheckFn<ProcessorContext>;
};
