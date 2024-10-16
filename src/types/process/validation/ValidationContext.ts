import { ProcessorContext } from '../ProcessorContext';
import { ValidationScope } from './ValidationScope';
import { ValidationRuleInfo } from './ValidationRuleInfo';
import { FetchFn } from 'types/formUtil';
export type SkipValidationFn = (context: ValidationContext) => boolean;
export type ValidationProcessContext = {
  rules?: ValidationRuleInfo[];
  skipValidation?: SkipValidationFn;
  fetch?: FetchFn;
  value?: any;
};
export type ValidationContext = ProcessorContext<ValidationScope> & ValidationProcessContext;
