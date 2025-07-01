import { FilterScope } from '..';
export type FetchScope = {
  fetched?: Record<string, boolean>;
} & FilterScope;
