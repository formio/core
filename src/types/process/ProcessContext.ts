import { 
    Component, 
    DataObject, 
    PassedComponentInstance, 
    ProcessComponents, 
    ProcessorContext, 
    ProcessorFn, 
    ProcessorFnSync, 
    ProcessType,
    FetchProcessContext,
    CalculationProcessContext,
    ConditionsProcessContext,
    DefaultValueProcessContext,
    ValidationProcessContext
} from "types";

export type ComponentInstances = {
    [key: string]: PassedComponentInstance;
};

export type BaseProcessContext<ProcessorScope> = {
    components: Component[];
    data: DataObject;
    scope: ProcessorScope;
    row?: DataObject;
    instances?: ComponentInstances;
    process?: ProcessType;
    form?: any;
    submission?: any;
    evalContext?: (context: ProcessorContext<ProcessorScope>) => any;
}

export type ReducedProcessContext<ProcessorScope> = BaseProcessContext<ProcessorScope> & FetchProcessContext & CalculationProcessContext & ConditionsProcessContext & DefaultValueProcessContext & ValidationProcessContext & {
    processes: ProcessComponents;
};

export type _ProcessContext<FunctionType, ProcessorScope> = BaseProcessContext<ProcessorScope> & {
    processors: FunctionType[];
}

export type ProcessContext<ProcessorScope> = _ProcessContext<ProcessorFn<ProcessorScope>, ProcessorScope>;
export type ProcessContextSync<ProcessorScope> = _ProcessContext<ProcessorFnSync<ProcessorScope>, ProcessorScope>;