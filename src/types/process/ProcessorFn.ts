import { ProcessorContext } from "types";
export type ProcessorFn<ProcessorScope> = (context: ProcessorContext<ProcessorScope>) => Promise<void>;
export type ProcessorFnSync<ProcessorScope> = (context: ProcessorContext<ProcessorScope>) => void;
