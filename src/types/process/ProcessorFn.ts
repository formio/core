import { FieldError } from "error";
import { RuleFn, ProcessorContext } from "types";

export type ProcessorFn = (context: ProcessorContext, rules?: RuleFn[]) => Promise<FieldError[]>;
