import { FieldError } from 'error';
import { UrlComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isUrlComponent = (component: any): component is UrlComponent => {
  return component && component.type === 'url';
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, value } = context;
  if (!isUrlComponent(component)) {
    return false;
  }

  if (component.multiple && Array.isArray(value) && value.length === 0) {
    return false;
  }

  if (!value) {
    return false;
  }
  return true;
};

export const validateUrlSync: RuleFnSync = (context: ValidationContext) => {
  const { value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  const error = new FieldError('invalid_url', context, 'url');
  if (typeof value !== 'string') {
    return error;
  }
  // From https://stackoverflow.com/questions/8667070/javascript-regular-expression-to-validate-url
  const re =
    /^(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  // From http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  const emailRe =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Allow urls to be valid if the component is pristine and no value is provided.
  return re.test(value) && !emailRe.test(value) ? null : error;
};

export const validateUrl: RuleFn = async (context: ValidationContext) => {
  return validateUrlSync(context);
};

export const validateUrlInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateUrl',
  process: validateUrl,
  processSync: validateUrlSync,
  shouldProcess: shouldValidate,
};
