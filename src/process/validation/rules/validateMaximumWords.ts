import { FieldError } from 'error';
import { TextFieldComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableTextFieldComponent = (component: any): component is TextFieldComponent => {
  return component && component.validate?.hasOwnProperty('maxWords');
};

const getValidationSetting = (component: any) => {
  let maxWords = (component as TextFieldComponent).validate?.maxWords;
  if (typeof maxWords === 'string') {
    maxWords = parseInt(maxWords, 10);
  }
  return maxWords;
};

const shouldValidate = (context: ValidationContext) => {
  const { component } = context;
  if (!isValidatableTextFieldComponent(component)) {
    return false;
  }
  const setting = getValidationSetting(component);
  if (setting === undefined) {
    return false;
  }
  if (!setting || Number.isNaN(setting)) {
    return false;
  }
  return true;
};

export const validateMaximumWords: RuleFn = async (context: ValidationContext) => {
  return validateMaximumWordsSync(context);
};

export const validateMaximumWordsSync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  const maxWords = getValidationSetting(component);
  if (maxWords && typeof value === 'string') {
    if (value.trim().split(/\s+/).length > maxWords) {
      const error = new FieldError('maxWords', {
        ...context,
        length: String(maxWords),
        setting: String(maxWords),
      });
      return error;
    }
  }
  return null;
};

export const validateMaximumWordsInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateMaximumWords',
  process: validateMaximumWords,
  processSync: validateMaximumWordsSync,
  shouldProcess: shouldValidate,
};
