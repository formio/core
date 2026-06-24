import {
  Component,
  ComponentPaths,
  DataObject,
  Form,
  PassedComponentInstance,
  ProcessorInfo,
  ProcessorType,
  Submission,
} from 'types';
import { ProcessType } from './ProcessType';

export type ProcessorContext<ProcessorScope> = {
  component: Component;
  path: string;
  data: DataObject;
  row: any;
  value?: any;
  form?: Form;
  paths?: ComponentPaths;
  submission?: Submission;
  components?: Component[];
  instance?: PassedComponentInstance;
  process?: ProcessType;
  processor?: ProcessorType;
  config?: Record<string, any>;
  index?: number;
  local?: boolean; // If the "data" being passed to the processors is local to the nested form.
  scope: ProcessorScope;
  parent?: Component | null;
  evalContext?: (context: ProcessorContext<ProcessorScope>) => any;
};

export type ProcessorsContext<ProcessorScope> = ProcessorContext<ProcessorScope> & {
  processors: ProcessorInfo<any, any>[];
};
