import { FilterScope } from '..';
export type DefaultValueScope = {
  defaultValue?: any;
  defaultValues?: Array<{
    path: string;
    value: any;
  }>;
} & FilterScope;
