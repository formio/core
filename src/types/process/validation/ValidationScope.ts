import { FieldError } from "error";
import { ProcessorScope, ValidationRuleInfo } from "..";

export type ValidationScope = {
    errors: FieldError[];
    rules?: ValidationRuleInfo[];
} & ProcessorScope;