import { ProcessorScope } from '..';
export type CalculationScope = {
  calculated?: Array<{
    path: string;
    value: any;
  }>;
} & ProcessorScope;
