import { DataObject } from 'types/DataObject';
import { ProcessorScope } from '..';
export type FilterScope = {
  filtered?: DataObject;
  filter?: Record<string, boolean>;
} & ProcessorScope;
