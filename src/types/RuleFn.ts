import { FieldError } from 'error';
import { ValidationContext } from './ValidationContext';
export type RuleFn = (context: ValidationContext) => Promise<FieldError | null>;
export type RuleFnSync = (context: ValidationContext) => FieldError | null;
