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
  return component && component.type === 'day' && component.hasOwnProperty('maxDate');
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, value } = context;
  if (!isValidatableDayComponent(component)) {
    return false;
  }
  if (isPartialDay(component, value as string | undefined)) {
    return false;
  }
  if (!getDateSetting((component as DayComponent).maxDate)) {
    return false;
  }
  return true;
};

export const validateMaximumDay: RuleFn = async (context: ValidationContext) => {
  return validateMaximumDaySync(context);
};

export const validateMaximumDaySync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  if (typeof value !== 'string') {
    throw new ProcessorError(
      `Cannot validate day value ${value} because it is not a string`,
      context,
      'validate:validateMaximumDay',
    );
  }
  // TODO: this validation probably goes for dates and days
  const format = getDateValidationFormat(component as DayComponent);
  const date = dayjs(value, format);
  const maxDate = getDateSetting((component as DayComponent).maxDate);

  if (maxDate === null) {
    return null;
  } else {
    maxDate.setHours(0, 0, 0, 0);
  }
  const error = new FieldError('maxDate', {
    ...context,
    maxDate: dayjs(maxDate).format(getDayFormat(component as DayComponent)),
    setting: String(maxDate),
  });
  return date.isBefore(dayjs(maxDate)) || date.isSame(dayjs(maxDate)) ? null : error;
};

export const validateMaximumDayInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateMaximumDay',
  process: validateMaximumDay,
  processSync: validateMaximumDaySync,
  shouldProcess: shouldValidate,
};
