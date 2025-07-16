import { FilterScope } from '..';
export type CalculationScope = {
  calculated?: Array<{
    path: string;
    value: any;
  }>;
} & FilterScope;
