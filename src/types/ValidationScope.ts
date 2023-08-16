import { FieldError } from "error";
import { ProcessorScope } from "./process";

export type ValidationScope = {
    errors: FieldError[];
} & ProcessorScope;