import { ProcessorContext } from "..";
import { FilterScope } from "./FilterScope";

type AdditionalFilterContext = {
    filtered?: any;
}

export type FilterContext = ProcessorContext<FilterScope> & AdditionalFilterContext;