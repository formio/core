import { ProcessorScope } from '..';
export type ConditionsScope = {
  conditionals?: Array<{
    path: string;
    conditionallyHidden: boolean;
  }>;
} & ProcessorScope;
