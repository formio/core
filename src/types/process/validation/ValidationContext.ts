import { ProcessorContext } from "../ProcessorContext";
import { ValidationScope } from "./ValidationScope";
import { ValidationRuleInfo } from './ValidationRuleInfo';
export type ValidationProcessContext = {
    rules?: ValidationRuleInfo[];
    fetch?: (url: string, options?: RequestInit) => Promise<Response>;
    value?: any;
};
export type ValidationContext = ProcessorContext<ValidationScope> & ValidationProcessContext;