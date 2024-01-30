import { FieldError } from 'error';
import { ValidationContext } from './process/validation/ValidationContext';
export type RuleFn = (context: ValidationContext) => Promise<FieldError | null>;
export type RuleFnSync = (context: ValidationContext) => FieldError | null;
