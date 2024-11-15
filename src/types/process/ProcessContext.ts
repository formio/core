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
  evalContext?: (context: ProcessorContext<ProcessorScope>) => any;
};

export type ProcessContext<ProcessorScope> = BaseProcessContext<ProcessorScope> & {
  processors: ProcessorInfo<any, any>[];
};
