import { ProcessorContext } from "../ProcessorContext";
import { FilterScope } from "./FilterScope";
export type FilterContext = ProcessorContext<FilterScope> & {
    filtered?: any;
};