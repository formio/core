import { ProcessorContext } from '../ProcessorContext';
import { ConditionsScope } from './ConditionsScope';
export type ConditionsProcessContext = object;
export type ConditionsContext = ProcessorContext<ConditionsScope> & ConditionsProcessContext;
