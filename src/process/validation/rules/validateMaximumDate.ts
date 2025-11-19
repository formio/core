import { ProcessorError, FieldError } from 'error';
import { DateTimeComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import {
  dayjs,
  getDateSetting,
  getFormattedDateSetting,
} from 'utils/date';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableDateComponent = (component: any): component is DateTimeComponent => {
  return component && component.type === 'datetime' && component.widget?.hasOwnProperty('maxDate');
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, value } = context;
  if (!isValidatableDateComponent(component) || !value) {
    return false;
  }
  if (!getDateSetting((component as DateTimeComponent).widget?.maxDate)) {
    return false;
  }
  return true;
};

export const validateMaximumDate: RuleFn = async (context: ValidationContext) => {
  return validateMaximumDateSync(context);
};

export const validateMaximumDateSync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  if (typeof value !== 'string') {
    throw new ProcessorError(
      `Cannot validate day value ${value} because it is not a string`,
      context,
      'validate:validateMaximumDate',
    );
  }

  const date = dayjs(value);
  let maxDate = getDateSetting((component as DateTimeComponent).widget?.maxDate);

  if (maxDate === null) {
    return null;
  }
  maxDate = (component as DateTimeComponent).widget?.enableTime ? dayjs(maxDate) : dayjs(maxDate).endOf('day');

  const error = new FieldError('maxDate', {
    ...context,
    maxDate: getFormattedDateSetting(maxDate, component as DateTimeComponent, context.submission?.metadata?.timezone),
    setting: String(maxDate),
  });
  return date.isBefore(maxDate) || date.isSame(maxDate) ? null : error;
};

export const validateMaximumDateInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateMaximumDate',
  process: validateMaximumDate,
  processSync: validateMaximumDateSync,
  shouldProcess: shouldValidate,
};
