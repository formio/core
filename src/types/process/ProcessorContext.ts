import {
  Component,
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
  submission?: Submission;
  components?: Component[];
  instance?: PassedComponentInstance;
  process?: ProcessType;
  processor?: ProcessorType;
  config?: Record<string, any>;
  index?: number;
  scope: ProcessorScope;
  parent?: Component | null;
  evalContext?: (context: ProcessorContext<ProcessorScope>) => any;
};

export type ProcessorsContext<ProcessorScope> = ProcessorContext<ProcessorScope> & {
  processors: ProcessorInfo<any, any>[];
};
