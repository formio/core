import { ProcessComponents, ProcessorScope } from "..";
export type ReducerScope = {
    processes: ProcessComponents;
    filtered?: any;
} & ProcessorScope;