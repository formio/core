import {
  Component,
  DataObject,
  PassedComponentInstance,
  ProcessorContext,
  ProcessType,
  ProcessorInfo,
  ComponentPaths,
} from 'types';

export type ComponentInstances = {
  [key: string]: PassedComponentInstance;
};

export type BaseProcessContext<ProcessorScope> = {
  components: Component[];
  data: DataObject;
  scope: ProcessorScope;
  row?: DataObject;
  instances?: ComponentInstances;
  process?: ProcessType;
  form?: any;
  submission?: any;
  flat?: boolean;
  parent?: Component;
  parentPaths?: ComponentPaths;
  local?: boolean; // If the "data" being passed to the processors is local to the nested form.
  evalContext?: (context: ProcessorContext<ProcessorScope>) => any;
};

export type ProcessContext<ProcessorScope> = BaseProcessContext<ProcessorScope> & {
  processors: ProcessorInfo<any, any>[];
};
