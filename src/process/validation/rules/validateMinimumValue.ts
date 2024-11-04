import { FieldError, ProcessorError } from 'error';
import { NumberComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableNumberComponent = (component: any): component is NumberComponent => {
  return component && component.validate?.hasOwnProperty('min');
};

const getValidationSetting = (component: any) => {
  let min = (component as NumberComponent).validate?.min;
  if (typeof min === 'string') {
    min = parseFloat(min);
  }
  return min;
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, value } = context;
  if (!isValidatableNumberComponent(component)) {
    return false;
  }
  if (Number.isNaN(parseFloat(value))) {
    return false;
  }
  if (Number.isNaN(getValidationSetting(component))) {
    return false;
  }
  return true;
};

export const validateMinimumValue: RuleFn = async (context: ValidationContext) => {
  return validateMinimumValueSync(context);
};

export const validateMinimumValueSync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  const min = getValidationSetting(component);
  if (min === undefined) {
    return null;
  }
  const parsedValue = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (Number.isNaN(parsedValue)) {
    throw new ProcessorError(
      `Cannot validate value ${parsedValue} because it is invalid`,
      context,
      'validate:validateMinimumValue',
    );
  }

  return parsedValue >= min
    ? null
    : new FieldError('min', { ...context, min: String(min), setting: String(min) });
};

export const validateMinimumValueInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateMinimumValue',
  process: validateMinimumValue,
  processSync: validateMinimumValueSync,
  shouldProcess: shouldValidate,
};
