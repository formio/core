import { ProcessorContext } from '../ProcessorContext';
import { PopulateScope } from './PopulateScope';
export type PopulateContext = ProcessorContext<PopulateScope> & {
  populated?: any;
};
