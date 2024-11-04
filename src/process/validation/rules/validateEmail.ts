import { FieldError } from 'error';
import { EmailComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableEmailComponent = (component: any): component is EmailComponent => {
  return component && component.type === 'email';
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, value } = context;
  if (!value) {
    return false;
  }
  if (!isValidatableEmailComponent(component)) {
    return false;
  }
  return true;
};

export const validateEmail: RuleFn = async (context: ValidationContext) => {
  return validateEmailSync(context);
};

export const validateEmailSync: RuleFnSync = (context: ValidationContext) => {
  const error = new FieldError('invalid_email', context, 'email');
  const { value } = context;
  if (!shouldValidate(context)) {
    return null;
  }

  // From http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Allow emails to be valid if the component is pristine and no value is provided.
  if (typeof value === 'string' && !emailRegex.test(value)) {
    return error;
  }
  return null;
};

export const validateEmailInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateEmail',
  process: validateEmail,
  processSync: validateEmailSync,
  shouldProcess: shouldValidate,
};
