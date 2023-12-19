import { ProcessorContext } from "../ProcessorContext";
import { ValidationScope } from "./ValidationScope";
import { ValidationRuleInfo } from './ValidationRuleInfo';
export type ValidationProcessContext = {
    rules?: ValidationRuleInfo[];
    value?: any;
};
export type ValidationContext = ProcessorContext<ValidationScope> & ValidationProcessContext;