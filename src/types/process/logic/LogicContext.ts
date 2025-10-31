import { ProcessorContext } from '../ProcessorContext';
import { LogicScope } from './LogicScope';
export type LogicContext = ProcessorContext<LogicScope> & {
  populated?: any;
  result?: any;
};
