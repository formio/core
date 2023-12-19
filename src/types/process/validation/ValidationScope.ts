import { FieldError } from "error";
import { ProcessorScope } from "..";
export type ValidationScope = ProcessorScope & {
    errors: FieldError[];
};