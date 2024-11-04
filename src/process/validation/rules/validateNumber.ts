import { FieldError } from '../../../error/FieldError';
import { NumberComponent, RuleFn, RuleFnSync, ValidationContext } from '../../../types/index';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableNumberComponent = (component: any): component is NumberComponent => {
  return component && component.type === 'number';
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, value } = context;
  if (!value) {
    return false;
  }
  if (component.multiple && Array.isArray(value) && value.length === 0) {
    return false;
  }
  if (!isValidatableNumberComponent(component)) {
    return false;
  }
  return true;
};

export const validateNumber: RuleFn = async (context: ValidationContext) => {
  return validateNumberSync(context);
};

export const validateNumberSync: RuleFnSync = (context: ValidationContext) => {
  const error = new FieldError('number', context);
  const { value } = context;

  if (value && typeof value !== 'number') {
    return error;
  }
  return null;
};

export const validateNumberInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateNumber',
  process: validateNumber,
  processSync: validateNumberSync,
  shouldProcess: shouldValidate,
};
