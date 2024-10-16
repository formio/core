import { RuleFn, RuleFnSync, TimeComponent, ValidationContext } from 'types';
import { isComponentDataEmpty } from 'utils/formUtil';
import { FieldError, ProcessorError } from 'error';

import { dayjs } from 'utils/date';
import { ProcessorInfo } from 'types/process/ProcessorInfo';
import customParsers from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParsers);

const isValidatableTimeComponent = (comp: any): comp is TimeComponent => {
  return comp && comp.type === 'time';
};

export const shouldValidate = (context: ValidationContext) => {
  const { component } = context;
  if (!isValidatableTimeComponent(component)) {
    return false;
  }
  return true;
};

export const validateTimeSync: RuleFnSync = (context: ValidationContext) => {
  const { component, data, path, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  try {
    if (!value || isComponentDataEmpty(component, data, path)) return null;
    const format = (component as TimeComponent).dataFormat || 'HH:mm:ss';
    const isValid = dayjs(String(value), format, true).isValid();
    return isValid ? null : new FieldError('time', context);
  } catch (ignoreErr) {
    throw new ProcessorError(
      `Could not validate time component ${component.key} with value ${value}`,
      context,
      'validate:validateTime',
    );
  }
};

export const validateTime: RuleFn = async (context: ValidationContext) => {
  return validateTimeSync(context);
};

export const validateTimeInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateTime',
  process: validateTime,
  processSync: validateTimeSync,
  shouldProcess: shouldValidate,
};
