import { ProcessorScope } from '..';
export type FetchScope = {
  fetched?: Record<string, boolean>;
} & ProcessorScope;
