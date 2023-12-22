import { ProcessorScope } from "..";
export type ConditionsScope = {
    conditionallyHidden?: any;
    conditionals?: Array<{
        path: string;
    }>;
} & ProcessorScope;