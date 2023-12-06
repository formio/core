import { ProcessorContext } from "..";
import { ReducerScope } from "./ReducerScope";

type AdditionalContext = {}
export type ReducerContext = ProcessorContext<ReducerScope> & AdditionalContext;