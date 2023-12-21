import { ProcessorScope } from "..";
export type CalculationScope = {
    value?: any;
    calculated?: Array<{
        path: string;
        value: any;
    }>;
} & ProcessorScope;