import { FieldError } from 'error';
import { RuleFn, RuleFnSync, TextFieldComponent, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
  return component && component.validate?.hasOwnProperty('minLength');
};

const getValidationSetting = (component: TextFieldComponent) => {
  let minLength = (component as TextFieldComponent).validate?.minLength;
  if (typeof minLength === 'string') {
    minLength = parseInt(minLength, 10);
  }
  return minLength;
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, value } = context;
  if (!isValidatableTextFieldComponent(component) || !value) {
    return false;
  }
  if (!value) {
    return false;
  }
  if (!getValidationSetting(component)) {
    return false;
  }
  return true;
};

export const validateMinimumLength: RuleFn = async (context: ValidationContext) => {
  return validateMinimumLengthSync(context);
};

export const validateMinimumLengthSync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  const minLength = getValidationSetting(component as TextFieldComponent);
  if (value && minLength && typeof value === 'string') {
    if (value.length < minLength) {
      const error = new FieldError('minLength', {
        ...context,
        length: String(minLength),
        setting: String(minLength),
      });
      return error;
    }
  }
  return null;
};

export const validateMinimumLengthInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateMinimumLength',
  process: validateMinimumLength,
  processSync: validateMinimumLengthSync,
  shouldProcess: shouldValidate,
};
