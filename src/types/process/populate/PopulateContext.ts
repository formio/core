import { ProcessorContext } from "..";
import { PopulateScope } from "./PopulateScope";

type AdditionalPopulateContext = {
    populated?: any;
}

export type PopulateContext = ProcessorContext<PopulateScope> & AdditionalPopulateContext;