import { FieldError } from "error";
import { RuleFn, ProcessorContext, RuleFnSync } from "types";

export type ProcessorFn = (context: ProcessorContext, rules?: RuleFn[]) => Promise<FieldError[]>;
export type ProcessorFnSync = (context: ProcessorContext, rules?: RuleFnSync[]) => FieldError[];
