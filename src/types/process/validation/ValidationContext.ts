import { ProcessorContext } from "..";
import { ValidationScope } from "./ValidationScope";

type AdditionalValidationContext = {
    value?: unknown;
}

export type ValidationContext = ProcessorContext<ValidationScope> & AdditionalValidationContext;