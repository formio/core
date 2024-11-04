import { FieldError } from 'error';
import {
  TextAreaComponent,
  TextFieldComponent,
  RuleFn,
  RuleFnSync,
  ValidationContext,
} from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableTextFieldComponent = (
  component: any,
): component is TextFieldComponent | TextAreaComponent => {
  return component && component.validate?.hasOwnProperty('pattern');
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, value } = context;
  if (!isValidatableTextFieldComponent(component) || !value) {
    return false;
  }

  const pattern = component.validate?.pattern;
  if (!pattern || !value || typeof value !== 'string') {
    return false;
  }
  return true;
};

export const validateRegexPattern: RuleFn = async (context: ValidationContext) => {
  return validateRegexPatternSync(context);
};

export const validateRegexPatternSync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  if (!shouldValidate(context) || !isValidatableTextFieldComponent(component)) {
    return null;
  }

  const pattern = (component as TextAreaComponent).validate?.pattern;
  const regex = new RegExp(`^${pattern}$`);
  return typeof value === 'string' && regex.test(value)
    ? null
    : new FieldError(
        component.validate?.patternMessage || 'pattern',
        { ...context, regex: pattern, pattern: pattern, setting: pattern },
        'pattern',
      );
};

export const validateRegexPatternInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateRegexPattern',
  process: validateRegexPattern,
  processSync: validateRegexPatternSync,
  shouldProcess: shouldValidate,
};
