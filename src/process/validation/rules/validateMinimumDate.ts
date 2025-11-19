import { ProcessorError, FieldError } from 'error';
import { DateTimeComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import {
  dayjs,
  getDateSetting,
  getFormattedDateSetting,
} from 'utils/date';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableDateComponent = (component: any): component is DateTimeComponent => {
  return component && component.type === 'datetime' && component.widget?.hasOwnProperty('minDate');
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, value } = context;
  if (!isValidatableDateComponent(component) || !value) {
    return false;
  }
  if (!getDateSetting((component as DateTimeComponent).widget?.minDate)) {
    return false;
  }
  return true;
};

export const validateMinimumDate: RuleFn = async (context: ValidationContext) => {
  return validateMinimumDateSync(context);
};

export const validateMinimumDateSync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  if (typeof value !== 'string') {
    throw new ProcessorError(
      `Cannot validate day value ${value} because it is not a string`,
      context,
      'validate:validateMinimumDate',
    );
  }

  const date = dayjs(value);
  let minDate = getDateSetting((component as DateTimeComponent).widget?.minDate);

  if (minDate === null) {
    return null;
  }

  minDate = (component as DateTimeComponent).widget?.enableTime ? dayjs(minDate) : dayjs(minDate).startOf('day');

  const error = new FieldError('minDate', {
    ...context,
    minDate: getFormattedDateSetting(minDate, component as DateTimeComponent, context.submission?.metadata?.timezone),
    setting: String(minDate),
  });
  return date.isAfter(minDate) || date.isSame(minDate) ? null : error;
};

export const validateMinimumDateInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateMinimumDate',
  process: validateMinimumDate,
  processSync: validateMinimumDateSync,
  shouldProcess: shouldValidate,
};
