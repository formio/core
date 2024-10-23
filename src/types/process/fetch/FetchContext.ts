import { FetchFn } from 'types/formUtil';
import { ProcessorContext } from '../ProcessorContext';
import { FetchScope } from './FetchScope';
export type FetchProcessContext = {
  fetch?: FetchFn;
  headers?: Record<string, string>;
};
export type FetchContext = ProcessorContext<FetchScope> & FetchProcessContext;
