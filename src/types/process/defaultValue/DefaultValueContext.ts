import { ProcessorContext } from "..";
import { DefaultValueScope } from "./DefaultValueScope";

type AdditionalDefaultValueContext = {
    value?: unknown;
}

export type DefaultValueContext = ProcessorContext<DefaultValueScope> & AdditionalDefaultValueContext;