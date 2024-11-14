import { FieldError, ProcessorError } from 'error';
import { DayComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableDayComponent = (component: any): component is DayComponent => {
  return (
    component &&
    component.type === 'day' &&
    (component.fields?.day?.required ||
      component.fields?.month?.required ||
      component.fields?.year?.required)
  );
};

export const shouldValidate = (context: ValidationContext) => {
  const { component } = context;
  return isValidatableDayComponent(component);
};

export const validateRequiredDay: RuleFn = async (context: ValidationContext) => {
  return validateRequiredDaySync(context);
};

export const validateRequiredDaySync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  if (!shouldValidate(context)) {
    return null;
  }
  if (!isValidatableDayComponent(component)) {
    return null;
  }
  if (!value) {
    return new FieldError('requiredDayEmpty', context, 'day');
  }
  if (typeof value !== 'string') {
    throw new ProcessorError(
      `Cannot validate required day field of ${value} because it is not a string`,
      context,
      'validate:validateRequiredDay',
    );
  }
  let [DAY, MONTH, YEAR] = component.dayFirst ? [0, 1, 2] : [1, 0, 2];
  const values = value.split('/').map((x) => parseInt(x, 10));
  let day = values[DAY];
  let month = values[MONTH];
  let year = values[YEAR];

  if (values.length !== 3) {
    if (component.fields.day.hide) {
      MONTH = MONTH === 0 ? 0 : MONTH - 1;
      YEAR = YEAR - 1;
      day = 0;
      month = values[MONTH];
      year = values[YEAR];
    }
    if (component.fields.month.hide) {
      DAY = DAY === 0 ? 0 : DAY - 1;
      YEAR = YEAR - 1;
      day = component.fields.day.hide && day === 0 ? 0 : values[DAY];
      month = 0;
      year = values[YEAR];
    }
    if (component.fields.year.hide) {
      day = component.fields.day.hide && day === 0 ? 0 : values[DAY];
      month = component.fields.month.hide && month === 0 ? 0 : values[MONTH];
      year = 0;
    }
  }

  if (!day && component.fields?.day?.required) {
    return new FieldError('requiredDayField', context, 'day');
  }
  if (!month && component.fields?.month?.required) {
    return new FieldError('requiredMonthField', context, 'day');
  }
  if (!year && component.fields?.year?.required) {
    return new FieldError('requiredYearField', context, 'day');
  }
  return null;
};

export const validateRequiredDayInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateRequiredDay',
  process: validateRequiredDay,
  processSync: validateRequiredDaySync,
  shouldProcess: shouldValidate,
};
