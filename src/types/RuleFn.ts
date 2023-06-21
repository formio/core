import { FieldError } from 'error';
import { ProcessorContext } from './process/ProcessorContext.js';

export type RuleContext = ProcessorContext & { value: unknown };

export type RuleFn = (context: RuleContext) => Promise<FieldError | null>;
