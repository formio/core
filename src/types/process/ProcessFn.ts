import { FieldError } from "error";
import { RuleFn, ProcessContext } from "types";

export type ProcessFn = (context: ProcessContext, rules?: RuleFn[]) => Promise<FieldError[]>;
