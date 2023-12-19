import { ProcessorContext } from "../ProcessorContext";
import { DefaultValueScope } from "./DefaultValueScope";
export type DefaultValueProcessContext = {};
export type DefaultValueContext = ProcessorContext<DefaultValueScope> & DefaultValueProcessContext;