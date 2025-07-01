import { ProcessorContext } from 'types';
export type ProcessorFn<ProcessorScope> = (
  context: ProcessorContext<ProcessorScope>,
) => Promise<void>;
export type ProcessorFnSync<ProcessorScope> = (context: ProcessorContext<ProcessorScope>) => void;
export type ProcessorPostFn<ProcessorScope> = (
  context: ProcessorContext<ProcessorScope>,
) => Promise<void>;
export type ProcessorPostFnSync<ProcessorScope> = (
  context: ProcessorContext<ProcessorScope>,
) => void;
