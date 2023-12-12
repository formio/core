import { ProcessComponents, ProcessorScope } from "..";
export type ReducerScope = {
    processes: ProcessComponents;
    data?: any;
} & ProcessorScope;