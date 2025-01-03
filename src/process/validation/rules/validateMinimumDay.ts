import { ProcessorError, FieldError } from 'error';
import { DayComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import {
  dayjs,
  isPartialDay,
  getDateValidationFormat,
  getDateSetting,
  getDayFormat,
} from 'utils/date';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableDayComponent = (component: any): component is DayComponent => {
  return component && component.type === 'day' && component.hasOwnProperty('minDate');
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, value } = context;
  if (!isValidatableDayComponent(component)) {
    return false;
  }
  if (isPartialDay(component, value as string | undefined)) {
    return false;
  }
  if (getDateSetting((component as DayComponent).minDate) === null) {
    return false;
  }
  return true;
};

export const validateMinimumDay: RuleFn = async (context: ValidationContext) => {
  return validateMinimumDaySync(context);
};

export const validateMinimumDaySync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  if (typeof value !== 'string') {
    throw new ProcessorError(
      `Cannot validate day value ${value} because it is not a string`,
      context,
      'validate:validateMinimumDay',
    );
  }

  const date = getDateValidationFormat(component as DayComponent)
    ? dayjs(value, getDateValidationFormat(component as DayComponent))
    : dayjs(value);
  const minDate = getDateSetting((component as DayComponent).minDate);

  if (minDate === null) {
    return null;
  } else {
    minDate.setHours(0, 0, 0, 0);
  }
  const error = new FieldError('minDate', {
    ...context,
    minDate: dayjs(minDate).format(getDayFormat(component as DayComponent)),
    setting: String(minDate),
  });
  return date.isAfter(minDate) || date.isSame(minDate) ? null : error;
};

export const validateMinimumDayInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateMinimumDay',
  process: validateMinimumDay,
  processSync: validateMinimumDaySync,
  shouldProcess: shouldValidate,
};
