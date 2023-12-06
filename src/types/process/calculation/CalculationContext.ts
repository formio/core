import { ProcessorContext } from "..";
import { CalculationScope } from "./CalculationScope";

type AdditionalCalculationContext = {
    value?: unknown;
}

export type CalculationContext = ProcessorContext<CalculationScope> & AdditionalCalculationContext;