import { ProcessorContext } from "./process";
import { ValidationScope } from "./ValidationScope";

type AdditionalValidationContext = {
    value?: unknown;
    test?: boolean;
}

export type ValidationContext = ProcessorContext<ValidationScope> & AdditionalValidationContext;