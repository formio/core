import { FieldError } from 'error';
import { RuleFn, RuleFnSync, ValidationContext } from 'types';
import { componentHasValue } from 'utils';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

export const shouldValidate = (context: ValidationContext): boolean => {
  const { component } = context;
  return !!component.validate?.required;
};

export const validateRequired: RuleFn = async (context: ValidationContext) => {
  return validateRequiredSync(context);
};

export const validateRequiredSync: RuleFnSync = (context: ValidationContext) => {
  const error = new FieldError('required', { ...context, setting: true });
  const { component, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  return componentHasValue(component, value) ? null : error;
};

export const validateRequiredInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateRequired',
  process: validateRequired,
  processSync: validateRequiredSync,
  shouldProcess: shouldValidate,
};
