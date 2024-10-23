import { ValidationContext } from '.';
import { ProcessorInfo } from '../ProcessorInfo';
import { FieldError } from 'error';
export type ValidationRuleInfo = ProcessorInfo<ValidationContext, FieldError | null>;
