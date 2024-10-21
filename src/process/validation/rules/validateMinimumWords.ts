import { FieldError } from 'error/FieldError';
import { RuleFn, RuleFnSync, TextFieldComponent, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
  return component && component.validate?.hasOwnProperty('minWords');
};

const getValidationSetting = (component: TextFieldComponent) => {
  let minWords = (component as TextFieldComponent).validate?.minWords;
  if (typeof minWords === 'string') {
    minWords = parseInt(minWords, 10);
  }
  return minWords;
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, value } = context;
  if (!isValidatableTextFieldComponent(component)) {
    return false;
  }
  if (!getValidationSetting(component)) {
    return false;
  }
  if (!value || typeof value !== 'string') {
    return false;
  }
  return true;
};

export const validateMinimumWords: RuleFn = async (context: ValidationContext) => {
  return validateMinimumWordsSync(context);
};

export const validateMinimumWordsSync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  const minWords = getValidationSetting(component as TextFieldComponent);
  if (minWords && value && typeof value === 'string') {
    if (value.trim().split(/\s+/).length < minWords) {
      const error = new FieldError('minWords', {
        ...context,
        length: String(minWords),
        setting: String(minWords),
      });
      return error;
    }
  }
  return null;
};

export const validateMinimumWordsInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateMinimumWords',
  process: validateMinimumWords,
  processSync: validateMinimumWordsSync,
  shouldProcess: shouldValidate,
};
