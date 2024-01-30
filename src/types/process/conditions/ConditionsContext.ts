import { ProcessorContext } from "../ProcessorContext";
import { ConditionsScope } from "./ConditionsScope";
export type ConditionsProcessContext = {};
export type ConditionsContext = ProcessorContext<ConditionsScope> & ConditionsProcessContext;