import { ProcessorScope } from "..";
export type FetchScope = {
  fetched?: Array<{
    path: string;
    value: any;
  }>;
} & ProcessorScope;