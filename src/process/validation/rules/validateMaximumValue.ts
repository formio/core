import { FieldError, ProcessorError } from 'error';
import { NumberComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableNumberComponent = (component: any): component is NumberComponent => {
  return component && component.validate?.hasOwnProperty('max');
};

const getValidationSetting = (component: any) => {
  let max = (component as NumberComponent).validate?.max;
  if (typeof max === 'string') {
    max = parseFloat(max);
  }
  return max;
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, value } = context;
  if (!isValidatableNumberComponent(component)) {
    return false;
  }
  if (value === null) {
    return false;
  }
  if (Number.isNaN(getValidationSetting(component))) {
    return false;
  }
  return true;
};

export const validateMaximumValue: RuleFn = async (context: ValidationContext) => {
  return validateMaximumValueSync(context);
};

export const validateMaximumValueSync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  const max = getValidationSetting(component);
  if (max === undefined || Number.isNaN(max)) {
    return null;
  }
  const parsedValue = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (Number.isNaN(parsedValue)) {
    throw new ProcessorError(
      `Cannot validate value ${parsedValue} because it is invalid`,
      context,
      'validate:validateMaximumValue',
    );
  }

  return parsedValue <= max
    ? null
    : new FieldError('max', { ...context, max: String(max), setting: String(max) });
};

export const validateMaximumValueInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateMaximumValue',
  process: validateMaximumValue,
  processSync: validateMaximumValueSync,
  shouldProcess: shouldValidate,
};
