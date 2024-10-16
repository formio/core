import { ProcessorContext } from '../ProcessorContext';
import { CalculationScope } from './CalculationScope';
export type CalculationProcessContext = {
  value?: any;
};
export type CalculationContext = ProcessorContext<CalculationScope> & CalculationProcessContext;
