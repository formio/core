import { ProcessorScope } from '..';
export type PopulateScope = {
  data: any;
  row?: any;
  populated?: Array<{
    path: string;
  }>;
} & ProcessorScope;
