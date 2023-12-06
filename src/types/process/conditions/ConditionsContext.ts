import { ProcessorContext } from "..";
import { ConditionsScope } from "./ConditionsScope";

type AdditionalConditionsContext = {
    value?: unknown;
}

export type ConditionsContext = ProcessorContext<ConditionsScope> & AdditionalConditionsContext;