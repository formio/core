import { ProcessorContext } from '../ProcessorContext';
import { DefaultValueScope } from './DefaultValueScope';
export type DefaultValueProcessContext = object;
export type DefaultValueContext = ProcessorContext<DefaultValueScope> & DefaultValueProcessContext;
